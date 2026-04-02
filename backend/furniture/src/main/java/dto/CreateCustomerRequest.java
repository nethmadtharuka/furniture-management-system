package com.suhada.furniture.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateCustomerRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+94|0)?[0-9]{9}$", message = "Invalid Sri Lankan phone number")
    private String phoneNumber;

    @Size(max = 500, message = "Address too long")
    private String address;

    @Size(max = 50, message = "City name too long")
    private String city;

    @Pattern(regexp = "^(\\+94|0)?[0-9]{9}$", message = "Invalid WhatsApp number")
    private String whatsappNumber;
}