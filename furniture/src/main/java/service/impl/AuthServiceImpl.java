package com.suhada.furniture.service.impl;

import com.suhada.furniture.dto.LoginRequest;
import com.suhada.furniture.dto.LoginResponse;
import com.suhada.furniture.dto.RegisterRequest;
import com.suhada.furniture.dto.UserDTO;
import com.suhada.furniture.entity.Role;
import com.suhada.furniture.entity.User;
import com.suhada.furniture.exception.BadRequestException;
import com.suhada.furniture.repository.UserRepository;
import com.suhada.furniture.security.JwtUtil;
import com.suhada.furniture.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // ============================================================
    // REGISTER USER
    // ============================================================
    @Override
    @Transactional
    public UserDTO register(RegisterRequest request) {

        log.info("Registering new user: {}", request.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            log.error("Email already exists: {}", request.getEmail());
            throw new BadRequestException("Email is already registered");
        }

        // Create user entity
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))  // Encrypt password!
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole() != null ? request.getRole() : Role.CUSTOMER)  // Default to CUSTOMER
                .build();

        // Save to database
        User savedUser = userRepository.save(user);

        log.info("✅ User registered successfully: {} with role: {}",
                savedUser.getEmail(), savedUser.getRole());

        return mapToDTO(savedUser);
    }

    // ============================================================
    // LOGIN USER
    // ============================================================
    @Override
    public LoginResponse login(LoginRequest request) {

        log.info("Login attempt for user: {}", request.getEmail());

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        log.info("✅ Authentication successful for: {}", request.getEmail());

        // Get user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);

        log.info("✅ JWT token generated for: {}", request.getEmail());

        // Get user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Build response
        LoginResponse response = LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();

        log.info("✅ Login successful for: {} (Role: {})", user.getEmail(), user.getRole());

        return response;
    }

    // ============================================================
    // GET CURRENT USER
    // ============================================================
    @Override
    public UserDTO getCurrentUser() {

        // Get current authentication from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("No authenticated user found");
        }

        String email = authentication.getName();

        log.info("Getting current user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return mapToDTO(user);
    }

    // ============================================================
    // HELPER METHOD
    // ============================================================
    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}