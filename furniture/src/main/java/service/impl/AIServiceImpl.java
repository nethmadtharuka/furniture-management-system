package com.suhada.furniture.service.impl;

import com.suhada.furniture.dto.AIQueryRequest;
import com.suhada.furniture.dto.AIQueryResponse;
import com.suhada.furniture.entity.Product;
import com.suhada.furniture.repository.ProductRepository;
import com.suhada.furniture.service.AIService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIServiceImpl implements AIService {

    private final OpenAiService openAiService;
    private final ProductRepository productRepository;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.max.tokens}")
    private Integer maxTokens;

    @Value("${openai.temperature}")
    private Double temperature;

    // ============================================================
    // GENERAL AI ASSISTANT
    // ============================================================
    @Override
    public AIQueryResponse askAI(AIQueryRequest request) {

        log.info("🤖 AI Query: {}", request.getQuery());

        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage(ChatMessageRole.SYSTEM.value(),
                "You are a helpful AI assistant for Suhada Furniture."));
        messages.add(new ChatMessage(ChatMessageRole.USER.value(), request.getQuery()));

        ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                .model(model)
                .messages(messages)
                .maxTokens(maxTokens)
                .temperature(temperature)
                .build();

        ChatCompletionResult result = openAiService.createChatCompletion(completionRequest);
        String response = result.getChoices().get(0).getMessage().getContent();

        log.info("✅ AI Response generated");

        return AIQueryResponse.builder()
                .response(response)
                .model(model)
                .tokensUsed(0)
                .build();
    }
    // ============================================================
    // GENERATE PRODUCT DESCRIPTION
    // ============================================================
    @Override
    public String generateProductDescription(String productName, String category) {

        log.info("🤖 Generating description for: {}", productName);

        String prompt = String.format(
                "Write a compelling product description for a furniture item:\n" +
                        "Product: %s\n" +
                        "Category: %s\n\n" +
                        "Requirements:\n" +
                        "- 3-4 sentences\n" +
                        "- Highlight quality and features\n" +
                        "- Professional and appealing tone\n" +
                        "- Include dimensions suggestion if relevant\n" +
                        "- Target premium furniture buyers",
                productName, category
        );

        AIQueryRequest request = new AIQueryRequest();
        request.setQuery(prompt);

        AIQueryResponse response = askAI(request);

        log.info("✅ Description generated successfully");

        return response.getResponse();
    }

    // ============================================================
    // GET PRODUCT RECOMMENDATIONS
    // ============================================================
    @Override
    public String getProductRecommendations(Long customerId) {

        log.info("🤖 Generating recommendations for customer: {}", customerId);

        // In real app, analyze customer's past orders
        String prompt =
                "Based on a customer who previously bought living room furniture, " +
                        "suggest 3 complementary products they might be interested in. " +
                        "Keep it brief and specific.";

        AIQueryRequest request = new AIQueryRequest();
        request.setQuery(prompt);

        AIQueryResponse response = askAI(request);

        return response.getResponse();
    }

    // ============================================================
    // PREDICT INVENTORY NEEDS
    // ============================================================
    @Override
    public String predictInventoryNeeds(Long productId) {

        log.info("🤖 Predicting inventory for product: {}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String prompt = String.format(
                "Analyze this furniture product inventory:\n" +
                        "Product: %s\n" +
                        "Current Stock: %d units\n" +
                        "Reorder Level: %d units\n" +
                        "Category: %s\n\n" +
                        "Provide:\n" +
                        "1. Restocking recommendation (when and how much)\n" +
                        "2. Seasonal considerations\n" +
                        "3. Risk assessment\n" +
                        "Keep it concise (3-4 sentences)",
                product.getName(),
                product.getStockQuantity(),
                product.getReorderLevel(),
                product.getCategory()
        );

        AIQueryRequest request = new AIQueryRequest();
        request.setQuery(prompt);

        AIQueryResponse response = askAI(request);

        log.info("✅ Inventory prediction generated");

        return response.getResponse();
    }

    // ============================================================
    // ANALYZE ORDER PATTERNS
    // ============================================================
    @Override
    public String analyzeOrderPatterns(Long customerId) {

        log.info("🤖 Analyzing order patterns for customer: {}", customerId);

        String prompt =
                "Analyze a customer's furniture purchase behavior:\n" +
                        "- 3 orders in past 6 months\n" +
                        "- Focus on living room and bedroom furniture\n" +
                        "- Average order value: Rs. 200,000\n\n" +
                        "Provide brief insights and next purchase predictions (2-3 sentences).";

        AIQueryRequest request = new AIQueryRequest();
        request.setQuery(prompt);

        AIQueryResponse response = askAI(request);

        return response.getResponse();
    }

    // ============================================================
    // GENERATE MARKETING CONTENT
    // ============================================================
    @Override
    public String generateMarketingContent(Long productId) {

        log.info("🤖 Generating marketing content for product: {}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String prompt = String.format(
                "Create engaging social media content for:\n" +
                        "Product: %s\n" +
                        "Category: %s\n" +
                        "Price: Rs. %s\n\n" +
                        "Create:\n" +
                        "1. Catchy headline\n" +
                        "2. 2-3 selling points\n" +
                        "3. Call to action\n" +
                        "4. Relevant hashtags\n" +
                        "Keep it exciting and premium!",
                product.getName(),
                product.getCategory(),
                product.getPrice()
        );

        AIQueryRequest request = new AIQueryRequest();
        request.setQuery(prompt);

        AIQueryResponse response = askAI(request);

        return response.getResponse();
    }
}

