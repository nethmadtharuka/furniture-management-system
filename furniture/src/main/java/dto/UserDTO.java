package com.suhada.furniture.dto;

import com.suhada.furniture.entity.Role;
import com.suhada.furniture.entity.Status;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private Status status;
    private LocalDateTime createdAt;

    // Note: NO password field! Security!
}