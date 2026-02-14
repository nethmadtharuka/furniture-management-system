package com.suhada.furniture.ai.dto;

import com.suhada.furniture.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFinderResponse {
    // Matched products with scores
    private List<ProductMatch> matches;

    // What AI understood from the query
    private ProductSearchIntent intent;

    // Follow-up question if needed
    private String followUpQuestion;

    // Total number of matches
    private int totalMatches;

    // Success/error
    private boolean success;
    private String message;
}
