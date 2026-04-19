package com.suhada.furniture.config;

import com.suhada.furniture.security.JwtAuthenticationFilter;
import com.suhada.furniture.security.AiRateLimitFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;
    private final AiRateLimitFilter aiRateLimitFilter;

    // ============================================================
    // PASSWORD ENCODER
    // ============================================================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ============================================================
    // AUTHENTICATION PROVIDER
    // ============================================================
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // ============================================================
    // AUTHENTICATION MANAGER
    // ============================================================
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    // ============================================================
    // SECURITY FILTER CHAIN
    // ============================================================
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ============================================================
                // CORS
                // ============================================================
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth

                        // ============================================================
                        // PUBLIC ENDPOINTS - NO AUTHENTICATION REQUIRED
                        // ============================================================
                        .requestMatchers(
                                "/api/auth/**",           // Login/Register
                                "/api/test/**",           // Testing endpoints
                                "/api/test-repo/**",      // Repo testing
                                // 3D Viewer
                                "/viewer/**",             // 3D viewer pages
                                "/uploads/**",            // Static 3D model files

                                // Swagger / API Docs
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/actuator/**"
                        )
                        .permitAll()

                        // ============================================================
                        // PUBLIC READ-ONLY ENDPOINTS
                        // ============================================================
                        // ============================================================
                        // - Products are publicly viewable
                        // - 3D model URLs can be fetched publicly
                        // ============================================================
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/customers/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/3d/**").permitAll()

                        // ============================================================
                        // AI ENDPOINTS
                        // ============================================================
                        // Keep AI behind authentication (protect cost + abuse)
                        .requestMatchers("/api/ai/**").authenticated()

                        // ============================================================
                        // ADMIN-ONLY ENDPOINTS
                        // ============================================================
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/customers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/orders/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/3d/**").hasRole("ADMIN")

                        // ============================================================
                        // STAFF + ADMIN ENDPOINTS
                        // ============================================================
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/products/3d/**").hasAnyRole("ADMIN", "STAFF")

                        // ============================================================
                        // ALL OTHER REQUESTS - REQUIRE AUTHENTICATION
                        // ============================================================
                        .anyRequest().authenticated())

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authenticationProvider(authenticationProvider())

                // Rate limit AI endpoints before auth processing
                .addFilterBefore(aiRateLimitFilter, UsernamePasswordAuthenticationFilter.class)

                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}