package com.suhada.furniture.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CustomerDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String city;
    private String whatsappNumber;
    private LocalDateTime createdAt;
}