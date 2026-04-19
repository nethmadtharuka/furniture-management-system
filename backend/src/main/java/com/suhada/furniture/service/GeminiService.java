package com.suhada.furniture.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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

    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(12);
    private static final Duration OPEN_CIRCUIT_FOR = Duration.ofSeconds(30);
    private static final int OPEN_CIRCUIT_AFTER_FAILURES = 5;

    private int consecutiveFailures = 0;
    private Instant circuitOpenedAt = null;

    private static final Duration CACHE_TTL = Duration.ofMinutes(5);
    private static final int CACHE_MAX = 200;
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    private static final class CacheEntry {
        final Instant expiresAt;
        final String value;

        CacheEntry(Instant expiresAt, String value) {
            this.expiresAt = expiresAt;
            this.value = value;
        }
    }

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
        String cacheKey = model + "::" + prompt;
        CacheEntry cached = cache.get(cacheKey);
        if (cached != null && cached.expiresAt.isAfter(Instant.now())) {
            return cached.value;
        }

        if (isCircuitOpen()) {
            throw new RuntimeException("Gemini temporarily unavailable (circuit open)");
        }

        log.info("📤 Sending prompt to Gemini");

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
                    .timeout(REQUEST_TIMEOUT)
                    .block(); // Block to get synchronous response

            // Parse response
            String aiResponse = parseResponse(response);
            log.info("✅ Gemini responded successfully");

            onSuccess();
            putCache(cacheKey, aiResponse);
            return aiResponse;

        } catch (WebClientResponseException e) {
            onFailure();
            throw new RuntimeException("Gemini request failed: " + e.getStatusCode().value(), e);
        } catch (Exception e) {
            log.error("❌ Error calling Gemini API: {}", e.getMessage(), e);
            log.error("Full exception: ", e);
            onFailure();
            throw new RuntimeException("Failed to generate content: " + e.getMessage(), e);
        }
    }

    private synchronized boolean isCircuitOpen() {
        if (circuitOpenedAt == null) return false;
        if (Instant.now().isAfter(circuitOpenedAt.plus(OPEN_CIRCUIT_FOR))) {
            circuitOpenedAt = null;
            consecutiveFailures = 0;
            return false;
        }
        return true;
    }

    private synchronized void onSuccess() {
        consecutiveFailures = 0;
        circuitOpenedAt = null;
    }

    private synchronized void onFailure() {
        consecutiveFailures += 1;
        if (consecutiveFailures >= OPEN_CIRCUIT_AFTER_FAILURES && circuitOpenedAt == null) {
            circuitOpenedAt = Instant.now();
        }
    }

    private void putCache(String key, String value) {
        if (cache.size() > CACHE_MAX) {
            // Best-effort eviction: clear the cache.
            cache.clear();
        }
        cache.put(key, new CacheEntry(Instant.now().plus(CACHE_TTL), value));
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
