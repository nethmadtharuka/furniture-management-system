package com.suhada.furniture.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * ============================================================================
 * CORS CONFIGURATION
 * ============================================================================
 * 
 * 🎓 WHAT IS CORS?
 * ================
 * CORS (Cross-Origin Resource Sharing) is a security feature in browsers.
 * 
 * THE PROBLEM:
 * - Frontend runs on: http://localhost:5174 (Vite dev server)
 * - Backend runs on: http://localhost:8080 (Spring Boot)
 * - Browser blocks requests between different origins (different ports)
 * 
 * THE SOLUTION:
 * - Backend explicitly allows frontend origin
 * - Backend specifies which HTTP methods are allowed
 * - Backend specifies which headers are allowed
 * 
 * VISUAL DIAGRAM:
 * ===============
 * 
 * [Browser - localhost:5174]
 * │
 * │ ─────── HTTP Request ──────────→ [Spring Boot - localhost:8080]
 * │ │
 * │ │ ✅ Checks CORS config
 * │ │ ✅ Origin allowed? YES
 * │ │ ✅ Method allowed? YES
 * │ │
 * │ ←────── Response + CORS Headers ─ │
 * │ Access-Control-Allow-Origin: http://localhost:5174
 * │
 * [Browser accepts response]
 * 
 * ============================================================================
 */
@Configuration
public class CorsConfig {

    /**
     * Configure CORS for the entire application
     * 
     * This bean is automatically picked up by Spring Security
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ============================================================
        // ALLOWED ORIGINS
        // ============================================================
        /**
         * Origins that are allowed to make requests to this backend.
         * 
         * Development:
         * - http://localhost:5173 (Vite default port)
         * - http://localhost:5174 (Your current Vite port)
         * - http://localhost:3000 (React/Next.js default)
         * 
         * Production:
         * - Add your production domain here
         * - Example: https://suhada-furniture.com
         */
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174"
        // Add production URL when deploying:
        // "https://your-production-domain.com"
        ));

        // ============================================================
        // ALLOWED METHODS
        // ============================================================
        /**
         * HTTP methods that frontend can use.
         * 
         * GET - Fetch data
         * POST - Create new resources
         * PUT - Update existing resources
         * DELETE - Delete resources
         * PATCH - Partial updates
         * OPTIONS - Preflight requests (browser sends this automatically)
         */
        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"));

        // ============================================================
        // ALLOWED HEADERS
        // ============================================================
        /**
         * Headers that frontend can send.
         * 
         * Common headers:
         * - Authorization: Bearer JWT_TOKEN
         * - Content-Type: application/json
         * - Accept: application/json
         * - X-Requested-With: XMLHttpRequest
         */
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "Cache-Control"));

        // ============================================================
        // EXPOSED HEADERS
        // ============================================================
        /**
         * Headers that frontend can read from response.
         * 
         * By default, browsers only expose these headers:
         * - Cache-Control, Content-Language, Content-Type, Expires, Last-Modified,
         * Pragma
         * 
         * If you want frontend to read custom headers, add them here.
         */
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Disposition"));

        // ============================================================
        // ALLOW CREDENTIALS
        // ============================================================
        /**
         * Allow cookies and authentication headers.
         * 
         * Set to true if you're using:
         * - JWT tokens in Authorization header
         * - Session cookies
         * - HTTP-only cookies
         */
        configuration.setAllowCredentials(true);

        // ============================================================
        // MAX AGE
        // ============================================================
        /**
         * How long (in seconds) the browser can cache CORS preflight response.
         * 
         * Preflight = OPTIONS request browser sends before actual request
         * 3600 seconds = 1 hour
         * 
         * This reduces the number of OPTIONS requests.
         */
        configuration.setMaxAge(3600L);

        // ============================================================
        // APPLY CONFIGURATION TO ALL ENDPOINTS
        // ============================================================
        /**
         * Apply this CORS configuration to all endpoints (/**)
         */
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
