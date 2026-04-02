package com.suhada.furniture.security;

import com.suhada.furniture.entity.User;
import com.suhada.furniture.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        log.info("🔍 Loading user by email: {}", email);

        // Fetch user from DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("❌ User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        log.info("✅ User found: {}, Role: {}", user.getFullName(), user.getRole());
        log.info("🔐 Password hash from DB: '{}'", user.getPassword());

        // IMPORTANT: Check if password is null or empty
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            log.error("❌ ERROR: User has EMPTY password in DB!");
        } else {
            log.info("Password length = {}", user.getPassword().length());
        }

        boolean disabled = user.getStatus() == com.suhada.furniture.entity.Status.INACTIVE;
        log.info("🟡 Account active: {}", !disabled);

        // Return Spring Security User object
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())   // Must be the bcrypt hash
                .authorities(getAuthorities(user))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(disabled)
                .build();
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        String authority = "ROLE_" + user.getRole().name();
        log.info("✔ Granted Authority: {}", authority);
        return Collections.singletonList(new SimpleGrantedAuthority(authority));
    }
}
