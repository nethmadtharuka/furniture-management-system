package com.suhada.furniture.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFinderRequest {
    // User's natural language query
    private String query;

    // Optional: Previous messages for context
    private List<String> conversationHistory;
}
