package com.suhada.furniture.controller;

import com.suhada.furniture.dto.ApiResponse;
import com.suhada.furniture.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Test controller to verify Gemini AI integration
 * 
 * This is a simple endpoint to test if Gemini is working correctly.
 * Once we confirm it works, we'll build the real AI features on top of this.
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class GeminiTestController {

    // Inject the GeminiService we created
    private final GeminiService geminiService;

    /**
     * Simple test endpoint: GET /api/test/gemini?message=Hello
     * 
     * This sends your message to Gemini and returns the AI's response.
     * 
     * Example: http://localhost:8080/api/test/gemini?message=Say hello in 5 words
     */
    @GetMapping("/gemini")
    public ResponseEntity<ApiResponse<String>> testGemini(
            @RequestParam(defaultValue = "Hello! Please introduce yourself.") String message) {

        log.info("🤖 Testing Gemini with message: {}", message);

        try {
            // Send the message to Gemini and get response
            String aiResponse = geminiService.generateContent(message);

            log.info("✅ Gemini responded: {}", aiResponse);

            return ResponseEntity.ok(
                    ApiResponse.success("Gemini is working!", aiResponse));

        } catch (Exception e) {
            log.error("❌ Error calling Gemini: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("Failed to call Gemini: " + e.getMessage()));
        }
    }

    /**
     * Health check endpoint
     * 
     * Just to verify the controller is loaded
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("✅ Gemini Test Controller is running!");
    }
}
