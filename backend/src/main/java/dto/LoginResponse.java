package com.suhada.furniture.dto;

import com.suhada.furniture.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    @Builder.Default  // ADD THIS
    private String type = "Bearer";

    private Long userId;
    private String email;
    private String fullName;
    private Role role;
}