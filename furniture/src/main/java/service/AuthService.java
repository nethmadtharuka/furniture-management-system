package com.suhada.furniture.service;

import com.suhada.furniture.dto.LoginRequest;
import com.suhada.furniture.dto.LoginResponse;
import com.suhada.furniture.dto.RegisterRequest;
import com.suhada.furniture.dto.UserDTO;

public interface AuthService {

    // Register new user
    UserDTO register(RegisterRequest request);

    // Login user
    LoginResponse login(LoginRequest request);

    // Get current logged-in user
    UserDTO getCurrentUser();
}