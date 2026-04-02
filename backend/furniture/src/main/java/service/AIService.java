package com.suhada.furniture.service;

import com.suhada.furniture.dto.AIQueryRequest;
import com.suhada.furniture.dto.AIQueryResponse;

public interface AIService {

    // General AI assistant
    AIQueryResponse askAI(AIQueryRequest request);

    // Generate product description
    String generateProductDescription(String productName, String category);

    // Get product recommendations
    String getProductRecommendations(Long customerId);

    // Predict inventory needs
    String predictInventoryNeeds(Long productId);

    // Analyze order patterns
    String analyzeOrderPatterns(Long customerId);

    // Generate marketing content
    String generateMarketingContent(Long productId);
}