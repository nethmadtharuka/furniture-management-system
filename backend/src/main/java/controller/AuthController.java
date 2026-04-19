package com.suhada.furniture.controller;

import com.suhada.furniture.dto.*;
import com.suhada.furniture.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    // ============================================================
    // REGISTER - POST /api/auth/register
    // ============================================================
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(
            @Valid @RequestBody RegisterRequest request) {

        log.info("📝 Registration request for: {}", request.getEmail());

        UserDTO user = authService.register(request);

        log.info("✅ User registered successfully: {}", user.getEmail());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", user));
    }

    // ============================================================
    // LOGIN - POST /api/auth/login
    // ============================================================
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        log.info("🔐 Login request for: {}", request.getEmail());

        LoginResponse response = authService.login(request);

        log.info("✅ Login successful for: {}", request.getEmail());

        return ResponseEntity.ok(
                ApiResponse.success("Login successful", response)
        );
    }

    // ============================================================
    // GET CURRENT USER - GET /api/auth/me
    // ============================================================
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser() {

        log.info("👤 Getting current user info");

        UserDTO user = authService.getCurrentUser();

        log.info("✅ Current user: {}", user.getEmail());

        return ResponseEntity.ok(
                ApiResponse.success("Current user retrieved", user)
        );
    }
}
