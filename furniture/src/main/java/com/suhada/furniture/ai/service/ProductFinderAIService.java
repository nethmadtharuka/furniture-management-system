package com.suhada.furniture.ai.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
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
import java.util.stream.Collectors;

/**
 * AI-powered product finder service
 * Uses Gemini to understand natural language queries and find matching products
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductFinderAIService {

    private final GeminiService geminiService;
    private final ProductRepository productRepository;
    private final Gson gson;

    /**
     * Find products based on natural language query
     */
    public ProductFinderResponse findProducts(ProductFinderRequest request) {
        log.info("🔍 Processing product finder request: {}", request.getQuery());

        try {
            // Step 1: Extract search intent from natural language
            ProductSearchIntent intent = extractSearchIntent(request);
            log.info("📊 Extracted intent: category={}, budget={}",
                    intent.getCategory(), intent.getBudget());

            // Step 2: Find matching products
            // TODO: Implement actual product search when Product entity and repository
            // exist
            List<ProductMatch> matches = findMatchingProducts(intent);

            // Step 3: Generate follow-up question if needed
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

    /**
     * Use AI to extract structured search intent from natural language
     */
    private ProductSearchIntent extractSearchIntent(ProductFinderRequest request) {
        String prompt = buildIntentExtractionPrompt(request.getQuery());

        try {
            String aiResponse = geminiService.generateContent(prompt);
            log.debug("🤖 AI Intent Response: {}", aiResponse);

            // Parse AI response to extract intent
            // For now, return a basic intent structure
            // TODO: Enhance with actual AI parsing
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
            log.error("Error extracting intent: {}", e.getMessage());
            // Return basic intent on error
            return ProductSearchIntent.builder()
                    .originalQuery(request.getQuery())
                    .build();
        }
    }

    /**
     * Build prompt for AI to extract search intent
     */
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

    /**
     * Find products matching the intent
     */
    private List<ProductMatch> findMatchingProducts(ProductSearchIntent intent) {
        log.info("🔎 Searching for products matching intent...");

        List<Product> products = new ArrayList<>();

        // Step 1: Get products based on category
        if (intent.getCategory() != null && !intent.getCategory().isEmpty()) {
            products = productRepository.findByCategory(intent.getCategory());
            log.info("Found {} products in category: {}", products.size(), intent.getCategory());
        } else {
            // If no category specified, get all products
            products = productRepository.findAll();
            log.info("No category specified, searching all {} products", products.size());
        }

        // Step 2: Filter by budget if specified
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

            log.info("After budget filter: {} products", products.size());
        }

        // Step 3: Score and rank products
        List<ProductMatch> matches = products.stream()
                .map(product -> createProductMatch(product, intent))
                .filter(match -> match.getMatchScore() > 0.3) // Only include decent matches
                .sorted(Comparator.comparingDouble(ProductMatch::getMatchScore).reversed())
                .limit(10) // Return top 10 matches
                .collect(Collectors.toList());

        log.info("✅ Returning {} product matches", matches.size());
        return matches;
    }

    /**
     * Create a ProductMatch with AI-generated explanation
     */
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

    /**
     * Calculate how well a product matches the intent
     */
    private double calculateMatchScore(Product product, ProductSearchIntent intent) {
        double score = 0.5; // Base score

        // Category match (very important)
        if (intent.getCategory() != null &&
                product.getCategory() != null &&
                product.getCategory().equalsIgnoreCase(intent.getCategory())) {
            score += 0.3;
        }

        // Budget match
        if (intent.getBudget() != null) {
            BigDecimal price = product.getPrice();
            BigDecimal maxBudget = intent.getBudget().getMax() != null
                    ? BigDecimal.valueOf(intent.getBudget().getMax())
                    : BigDecimal.valueOf(Double.MAX_VALUE);

            if (price.compareTo(maxBudget) <= 0) {
                score += 0.2;
            }
        }

        // Stock availability
        if (product.getStockQuantity() > 0) {
            score += 0.1;
        }

        // Name/description relevance (simple keyword matching)
        if (intent.getOriginalQuery() != null) {
            String query = intent.getOriginalQuery().toLowerCase();
            String productText = (product.getName() + " " +
                    (product.getDescription() != null ? product.getDescription() : ""))
                    .toLowerCase();

            // Check for keyword matches
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

        return Math.min(score, 1.0); // Cap at 1.0
    }

    /**
     * Generate reasons why this product matches
     */
    private List<String> generateMatchReasons(Product product, ProductSearchIntent intent) {
        List<String> reasons = new ArrayList<>();

        if (intent.getCategory() != null &&
                product.getCategory() != null &&
                product.getCategory().equalsIgnoreCase(intent.getCategory())) {
            reasons.add("Matches category: " + intent.getCategory());
        }

        if (intent.getBudget() != null && intent.getBudget().getMax() != null) {
            if (product.getPrice().compareTo(BigDecimal.valueOf(intent.getBudget().getMax())) <= 0) {
                reasons.add("Within budget");
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

    /**
     * Generate AI explanation for why this product matches
     */
    private String generateMatchExplanation(Product product, ProductSearchIntent intent, double score) {
        // Simple explanation for now
        // TODO: Use Gemini to generate more natural explanations

        if (score > 0.8) {
            return String.format("Excellent match! This %s fits your requirements perfectly.",
                    product.getName());
        } else if (score > 0.6) {
            return String.format("Good match. This %s meets most of your criteria.",
                    product.getName());
        } else if (score > 0.4) {
            return String.format("Possible match. This %s might work for you.",
                    product.getName());
        } else {
            return String.format("This %s partially matches your search.",
                    product.getName());
        }
    }

    /**
     * Generate follow-up question if information is missing
     */
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

    // Helper methods for parsing AI response

    private String extractCategory(String aiResponse) {
        // Simple keyword extraction
        // TODO: Enhance with proper AI response parsing
        String lower = aiResponse.toLowerCase();
        if (lower.contains("chair"))
            return "chair";
        if (lower.contains("table"))
            return "table";
        if (lower.contains("sofa"))
            return "sofa";
        if (lower.contains("bed"))
            return "bed";
        if (lower.contains("cabinet"))
            return "cabinet";
        return null;
    }

    private ProductSearchIntent.Budget extractBudget(String aiResponse) {
        // TODO: Implement budget extraction from AI response
        return null;
    }

    private ProductSearchIntent.Room extractRoom(String aiResponse) {
        // TODO: Implement room extraction from AI response
        String lower = aiResponse.toLowerCase();
        if (lower.contains("bedroom")) {
            return ProductSearchIntent.Room.builder()
                    .type("bedroom")
                    .build();
        }
        if (lower.contains("living room")) {
            return ProductSearchIntent.Room.builder()
                    .type("living-room")
                    .build();
        }
        if (lower.contains("office")) {
            return ProductSearchIntent.Room.builder()
                    .type("office")
                    .build();
        }
        return null;
    }

    private List<String> extractList(String aiResponse, String category) {
        // TODO: Implement list extraction from AI response
        return new ArrayList<>();
    }
}