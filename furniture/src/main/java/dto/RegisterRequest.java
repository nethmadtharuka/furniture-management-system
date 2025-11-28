package com.suhada.furniture.dto;

import com.suhada.furniture.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 20, message = "Password must be between 6 and 20 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
            message = "Password must contain at least one uppercase, one lowercase, and one number")
    private String password;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String fullName;

    @Pattern(regexp = "^(\\+94|0)?[0-9]{9}$", message = "Invalid phone number format")
    private String phoneNumber;

    // Role is optional - defaults to CUSTOMER
    private Role role;
}