package com.suhada.furniture.controller;

import com.suhada.furniture.dto.AIQueryRequest;
import com.suhada.furniture.dto.AIQueryResponse;
import com.suhada.furniture.dto.ApiResponse;
import com.suhada.furniture.service.AIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AIController {

    private final AIService aiService;

    // ============================================================
    // GENERAL AI ASSISTANT - POST /api/ai/ask
    // ============================================================
    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<AIQueryResponse>> askAI(
            @RequestBody AIQueryRequest request) {

        log.info("🤖 AI query received: {}", request.getQuery());

        AIQueryResponse response = aiService.askAI(request);

        return ResponseEntity.ok(
                ApiResponse.success("AI response generated", response)
        );
    }

    // ============================================================
    // GENERATE PRODUCT DESCRIPTION - GET /api/ai/product-description
    // ============================================================
    @GetMapping("/product-description")
    public ResponseEntity<ApiResponse<String>> generateProductDescription(
            @RequestParam String productName,
            @RequestParam String category) {

        log.info("🤖 Generating description for: {}", productName);

        String description = aiService.generateProductDescription(productName, category);

        return ResponseEntity.ok(
                ApiResponse.success("Product description generated", description)
        );
    }

    // ============================================================
    // PRODUCT RECOMMENDATIONS - GET /api/ai/recommendations/{customerId}
    // ============================================================
    @GetMapping("/recommendations/{customerId}")
    public ResponseEntity<ApiResponse<String>> getRecommendations(
            @PathVariable Long customerId) {

        log.info("🤖 Getting recommendations for customer: {}", customerId);

        String recommendations = aiService.getProductRecommendations(customerId);

        return ResponseEntity.ok(
                ApiResponse.success("Recommendations generated", recommendations)
        );
    }

    // ============================================================
    // INVENTORY PREDICTION - GET /api/ai/inventory-prediction/{productId}
    // ============================================================
    @GetMapping("/inventory-prediction/{productId}")
    public ResponseEntity<ApiResponse<String>> predictInventory(
            @PathVariable Long productId) {

        log.info("🤖 Predicting inventory for product: {}", productId);

        String prediction = aiService.predictInventoryNeeds(productId);

        return ResponseEntity.ok(
                ApiResponse.success("Inventory prediction generated", prediction)
        );
    }

    // ============================================================
    // ORDER PATTERN ANALYSIS - GET /api/ai/analyze-orders/{customerId}
    // ============================================================
    @GetMapping("/analyze-orders/{customerId}")
    public ResponseEntity<ApiResponse<String>> analyzeOrders(
            @PathVariable Long customerId) {

        log.info("🤖 Analyzing orders for customer: {}", customerId);

        String analysis = aiService.analyzeOrderPatterns(customerId);

        return ResponseEntity.ok(
                ApiResponse.success("Order analysis complete", analysis)
        );
    }

    // ============================================================
    // MARKETING CONTENT - GET /api/ai/marketing/{productId}
    // ============================================================
    @GetMapping("/marketing/{productId}")
    public ResponseEntity<ApiResponse<String>> generateMarketing(
            @PathVariable Long productId) {

        log.info("🤖 Generating marketing content for product: {}", productId);

        String content = aiService.generateMarketingContent(productId);

        return ResponseEntity.ok(
                ApiResponse.success("Marketing content generated", content)
        );
    }
}