package com.suhada.furniture.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Lightweight in-memory rate limiter for AI endpoints to prevent abuse/cost spikes.
 *
 * Notes:
 * - Best-effort only (per-instance). For production multi-instance, prefer a shared store (Redis) or gateway limits.
 * - Uses a fixed-window limit per IP.
 */
@Slf4j
@Component
public class AiRateLimitFilter extends OncePerRequestFilter {

    private static final int LIMIT_PER_WINDOW = 30; // requests
    private static final long WINDOW_SECONDS = 60;  // per minute

    private static final class Window {
        long windowStartEpochSecond;
        int count;

        Window(long windowStartEpochSecond, int count) {
            this.windowStartEpochSecond = windowStartEpochSecond;
            this.count = count;
        }
    }

    private final Map<String, Window> ipWindows = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path == null || !path.startsWith("/api/ai/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String ip = getClientIp(request);
        long now = Instant.now().getEpochSecond();
        long windowStart = now - (now % WINDOW_SECONDS);

        Window w = ipWindows.compute(ip, (k, existing) -> {
            if (existing == null || existing.windowStartEpochSecond != windowStart) {
                return new Window(windowStart, 1);
            }
            existing.count += 1;
            return existing;
        });

        if (w != null && w.count > LIMIT_PER_WINDOW) {
            log.warn("AI rate limit exceeded for ip={} count={}", ip, w.count);
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"success\":false,\"message\":\"Rate limit exceeded. Please retry later.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // first IP in the list
            int comma = forwarded.indexOf(',');
            return (comma > 0 ? forwarded.substring(0, comma) : forwarded).trim();
        }
        return request.getRemoteAddr();
    }
}

