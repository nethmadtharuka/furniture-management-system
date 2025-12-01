package com.suhada.furniture.dto;

import lombok.Data;

@Data
public class AIQueryRequest {
    private String query;
    private String context;  // Optional: product info, order details, etc.
}