package com.suhada.furniture.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Service to interact with Google Gemini AI via REST API
 * 
 * This service uses WebClient to make HTTP calls to Gemini's REST API.
 * It's simpler than using the SDK and gives us full control.
 */
@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;
    private final String apiKey;
    private final String model;
    private final String baseUrl;
    private final Gson gson;

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.model.text}") String model,
            @Value("${gemini.api.base-url}") String baseUrl,
            WebClient.Builder webClientBuilder) {

        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = baseUrl;
        this.gson = new Gson();

        // Build WebClient for Gemini API
        this.webClient = webClientBuilder
                .baseUrl(baseUrl + "/models")
                .build();

        log.info("🤖 Gemini Service initialized with model: {}", model);
    }

    /**
     * Generate text content from a prompt
     * 
     * @param prompt The text prompt to send to Gemini
     * @return AI-generated response text
     */
    public String generateContent(String prompt) {
        log.info("📤 Sending prompt to Gemini: {}", prompt);

        try {
            // Build request body
            JsonObject requestBody = buildRequestBody(prompt);

            // Make API call
            String response = webClient
                    .post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody.toString())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Block to get synchronous response

            // Parse response
            String aiResponse = parseResponse(response);
            log.info("✅ Gemini responded successfully");

            return aiResponse;

        } catch (Exception e) {
            log.error("❌ Error calling Gemini API: {}", e.getMessage(), e);
            log.error("Full exception: ", e);
            throw new RuntimeException("Failed to generate content: " + e.getMessage(), e);
        }
    }

    /**
     * Build the JSON request body for Gemini API
     * 
     * Format:
     * {
     * "contents": [{
     * "parts": [{"text": "your prompt here"}]
     * }]
     * }
     */
    private JsonObject buildRequestBody(String prompt) {
        JsonObject requestBody = new JsonObject();

        // Create parts array
        JsonArray parts = new JsonArray();
        JsonObject part = new JsonObject();
        part.addProperty("text", prompt);
        parts.add(part);

        // Create content object
        JsonObject content = new JsonObject();
        content.add("parts", parts);

        // Create contents array
        JsonArray contents = new JsonArray();
        contents.add(content);

        requestBody.add("contents", contents);

        return requestBody;
    }

    /**
     * Parse the response from Gemini API
     * 
     * Response format:
     * {
     * "candidates": [{
     * "content": {
     * "parts": [{"text": "AI response here"}]
     * }
     * }]
     * }
     */
    private String parseResponse(String response) {
        try {
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);

            return jsonResponse
                    .getAsJsonArray("candidates")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("content")
                    .getAsJsonArray("parts")
                    .get(0).getAsJsonObject()
                    .get("text").getAsString();

        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", response);
            throw new RuntimeException("Invalid response format from Gemini");
        }
    }
}
