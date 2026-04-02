package com.suhada.furniture.ai.service;

import com.google.gson.Gson;
import com.suhada.furniture.ai.dto.*;
import com.suhada.furniture.entity.Product;
import com.suhada.furniture.repository.ProductRepository;
import com.suhada.furniture.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductFinderAIService {

    private final GeminiService geminiService;
    private final ProductRepository productRepository;
    private final Gson gson;

    public ProductFinderResponse findProducts(ProductFinderRequest request) {
        log.info("🔍 Processing product finder request: {}", request.getQuery());

        try {
            ProductSearchIntent intent = extractSearchIntent(request);
            log.info("📊 Extracted intent: category={}, budget={}",
                    intent.getCategory(), intent.getBudget());

            List<ProductMatch> matches = findMatchingProducts(intent);
            String followUpQuestion = generateFollowUpQuestion(intent);

            return ProductFinderResponse.builder()
                    .matches(matches)
                    .intent(intent)
                    .followUpQuestion(followUpQuestion)
                    .totalMatches(matches.size())
                    .success(true)
                    .message("Found " + matches.size() + " matching products")
                    .build();

        } catch (Exception e) {
            log.error("❌ Error in product finder: {}", e.getMessage(), e);
            return ProductFinderResponse.builder()
                    .matches(new ArrayList<>())
                    .totalMatches(0)
                    .success(false)
                    .message("Error processing request: " + e.getMessage())
                    .build();
        }
    }

    private ProductSearchIntent extractSearchIntent(ProductFinderRequest request) {
        String prompt = buildIntentExtractionPrompt(request.getQuery());

        try {
            String aiResponse = geminiService.generateContent(prompt);
            log.debug("🤖 AI Intent Response: {}", aiResponse);

            return ProductSearchIntent.builder()
                    .originalQuery(request.getQuery())
                    .category(extractCategory(aiResponse))
                    .budget(extractBudget(aiResponse))
                    .room(extractRoom(aiResponse))
                    .style(extractList(aiResponse, "style"))
                    .materials(extractList(aiResponse, "materials"))
                    .colors(extractList(aiResponse, "colors"))
                    .features(extractList(aiResponse, "features"))
                    .missingInfo(new ArrayList<>())
                    .build();

        } catch (Exception e) {
            log.warn("⚠️ Gemini failed ({}), using keyword fallback", e.getMessage());
            // FIX: keyword fallback so filtering still works when Gemini is down
            return keywordFallback(request.getQuery());
        }
    }

    /**
     * FIX: Keyword-based fallback when Gemini is unavailable (429, 400, timeout)
     * Handles patterns like: "bed under 50000", "chair below 30000", "sofa"
     */
    private ProductSearchIntent keywordFallback(String query) {
        String lower = query.toLowerCase();

        String category = extractCategoryFromText(lower);
        ProductSearchIntent.Budget budget = extractBudgetFromText(lower);

        log.info("🔄 Keyword fallback → category={}, budget={}", category, budget);

        return ProductSearchIntent.builder()
                .originalQuery(query)
                .category(category)
                .budget(budget)
                .missingInfo(new ArrayList<>())
                .build();
    }

    /**
     * FIX: Extract budget from AI response text — was always returning null before
     * Handles: "under 50000", "below 30000", "within 25000",
     *          "up to 40000", "50000", "budget: 50000", "Rs. 50000"
     */
    private ProductSearchIntent.Budget extractBudget(String aiResponse) {
        return extractBudgetFromText(aiResponse);
    }

    /**
     * Shared budget extraction logic used by both AI response parser and keyword fallback
     */
    private ProductSearchIntent.Budget extractBudgetFromText(String text) {
        String lower = text.toLowerCase();

        // Pattern matches: "under 50000", "below 30,000", "within 50000",
        //                  "up to 40000", "upto 40000", "budget 50000", "50000"
        Pattern pattern = Pattern.compile(
                "(?:under|below|within|up\\s*to|upto|budget[:\\s]+|rs\\.?\\s*)?([0-9][0-9,]+)"
        );
        Matcher matcher = pattern.matcher(lower);

        Double maxBudget = null;
        while (matcher.find()) {
            String numStr = matcher.group(1).replace(",", "");
            try {
                double value = Double.parseDouble(numStr);
                // Only treat as budget if it's a reasonable furniture price (> 1000)
                if (value > 1000) {
                    maxBudget = value;
                    break;
                }
            } catch (NumberFormatException ignored) {}
        }

        if (maxBudget != null) {
            return ProductSearchIntent.Budget.builder()
                    .max(maxBudget)
                    .min(0.0)
                    .build();
        }
        return null;
    }

    private String extractCategory(String aiResponse) {
        return extractCategoryFromText(aiResponse.toLowerCase());
    }

    /**
     * Shared category extraction used by both AI parser and keyword fallback
     */
    private String extractCategoryFromText(String text) {
        if (text.contains("chair"))    return "chair";
        if (text.contains("table"))    return "table";
        if (text.contains("sofa"))     return "sofa";
        if (text.contains("bed"))      return "bed";
        if (text.contains("cabinet"))  return "cabinet";
        if (text.contains("wardrobe")) return "wardrobe";
        if (text.contains("shelf") || text.contains("shelve")) return "shelf";
        return null;
    }

    private String buildIntentExtractionPrompt(String query) {
        return String.format("""
                You are a furniture store assistant. Analyze this customer query and extract structured information.

                Customer Query: "%s"

                Extract and provide:
                1. Category (chair, table, sofa, bed, cabinet, etc.)
                2. Budget range (if mentioned)
                3. Room type (bedroom, living room, office, dining room, etc.)
                4. Style preferences (modern, vintage, minimalist, traditional, etc.)
                5. Material preferences (wood, metal, fabric, leather, etc.)
                6. Color preferences
                7. Special features (storage, foldable, adjustable, etc.)

                Provide your analysis in a clear, structured format.
                """, query);
    }

    private List<ProductMatch> findMatchingProducts(ProductSearchIntent intent) {
        log.info("🔎 Searching for products matching intent...");

        List<Product> products;

        if (intent.getCategory() != null && !intent.getCategory().isEmpty()) {
            products = productRepository.findByCategory(intent.getCategory());
            log.info("Found {} products in category: {}", products.size(), intent.getCategory());
        } else {
            products = productRepository.findAll();
            log.info("No category specified, searching all {} products", products.size());
        }

        if (intent.getBudget() != null) {
            BigDecimal minPrice = intent.getBudget().getMin() != null
                    ? BigDecimal.valueOf(intent.getBudget().getMin())
                    : BigDecimal.ZERO;
            BigDecimal maxPrice = intent.getBudget().getMax() != null
                    ? BigDecimal.valueOf(intent.getBudget().getMax())
                    : BigDecimal.valueOf(Double.MAX_VALUE);

            products = products.stream()
                    .filter(p -> p.getPrice().compareTo(minPrice) >= 0
                            && p.getPrice().compareTo(maxPrice) <= 0)
                    .collect(Collectors.toList());

            log.info("After budget filter (max={}): {} products remain",
                    intent.getBudget().getMax(), products.size());
        }

        List<ProductMatch> matches = products.stream()
                .map(product -> createProductMatch(product, intent))
                .filter(match -> match.getMatchScore() > 0.3)
                .sorted(Comparator.comparingDouble(ProductMatch::getMatchScore).reversed())
                .limit(10)
                .collect(Collectors.toList());

        log.info("✅ Returning {} product matches", matches.size());
        return matches;
    }

    private ProductMatch createProductMatch(Product product, ProductSearchIntent intent) {
        double score = calculateMatchScore(product, intent);
        List<String> matchReasons = generateMatchReasons(product, intent);
        String explanation = generateMatchExplanation(product, intent, score);

        return ProductMatch.builder()
                .product(product)
                .matchScore(score)
                .explanation(explanation)
                .matchReasons(matchReasons)
                .build();
    }

    private double calculateMatchScore(Product product, ProductSearchIntent intent) {
        double score = 0.5;

        if (intent.getCategory() != null &&
                product.getCategory() != null &&
                product.getCategory().equalsIgnoreCase(intent.getCategory())) {
            score += 0.3;
        }

        if (intent.getBudget() != null) {
            BigDecimal price = product.getPrice();
            BigDecimal maxBudget = intent.getBudget().getMax() != null
                    ? BigDecimal.valueOf(intent.getBudget().getMax())
                    : BigDecimal.valueOf(Double.MAX_VALUE);

            if (price.compareTo(maxBudget) <= 0) {
                score += 0.2;
            }
        }

        if (product.getStockQuantity() > 0) {
            score += 0.1;
        }

        if (intent.getOriginalQuery() != null) {
            String query = intent.getOriginalQuery().toLowerCase();
            String productText = (product.getName() + " " +
                    (product.getDescription() != null ? product.getDescription() : ""))
                    .toLowerCase();

            String[] keywords = query.split("\\s+");
            long matchCount = 0;
            for (String keyword : keywords) {
                if (productText.contains(keyword)) {
                    matchCount++;
                }
            }

            if (keywords.length > 0) {
                score += (matchCount / (double) keywords.length) * 0.2;
            }
        }

        return Math.min(score, 1.0);
    }

    private List<String> generateMatchReasons(Product product, ProductSearchIntent intent) {
        List<String> reasons = new ArrayList<>();

        if (intent.getCategory() != null &&
                product.getCategory() != null &&
                product.getCategory().equalsIgnoreCase(intent.getCategory())) {
            reasons.add("Matches category: " + intent.getCategory());
        }

        if (intent.getBudget() != null && intent.getBudget().getMax() != null) {
            if (product.getPrice().compareTo(BigDecimal.valueOf(intent.getBudget().getMax())) <= 0) {
                reasons.add("Within your budget of " + intent.getBudget().getMax().longValue());
            }
        }

        if (product.getStockQuantity() > 0) {
            reasons.add("In stock");
        } else {
            reasons.add("Out of stock");
        }

        if (product.isLowStock() && product.getStockQuantity() > 0) {
            reasons.add("Limited stock");
        }

        return reasons;
    }

    private String generateMatchExplanation(Product product, ProductSearchIntent intent, double score) {
        if (score > 0.8) {
            return String.format("Excellent match! This %s fits your requirements perfectly.", product.getName());
        } else if (score > 0.6) {
            return String.format("Good match. This %s meets most of your criteria.", product.getName());
        } else if (score > 0.4) {
            return String.format("Possible match. This %s might work for you.", product.getName());
        } else {
            return String.format("This %s partially matches your search.", product.getName());
        }
    }

    private String generateFollowUpQuestion(ProductSearchIntent intent) {
        List<String> missingInfo = new ArrayList<>();

        if (intent.getCategory() == null || intent.getCategory().isEmpty()) {
            missingInfo.add("product category");
        }
        if (intent.getBudget() == null) {
            missingInfo.add("budget");
        }
        if (intent.getRoom() == null) {
            missingInfo.add("room type");
        }

        if (!missingInfo.isEmpty()) {
            return "To help you better, could you tell me more about: " +
                    String.join(", ", missingInfo) + "?";
        }

        return null;
    }

    private ProductSearchIntent.Room extractRoom(String aiResponse) {
        String lower = aiResponse.toLowerCase();
        if (lower.contains("bedroom")) {
            return ProductSearchIntent.Room.builder().type("bedroom").build();
        }
        if (lower.contains("living room")) {
            return ProductSearchIntent.Room.builder().type("living-room").build();
        }
        if (lower.contains("office")) {
            return ProductSearchIntent.Room.builder().type("office").build();
        }
        return null;
    }

    private List<String> extractList(String aiResponse, String category) {
        return new ArrayList<>();
    }
}