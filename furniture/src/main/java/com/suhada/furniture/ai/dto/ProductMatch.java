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
public class ProductMatch {
    // The matched product
    private Product product;

    // Match score (0.0 to 1.0)
    private double matchScore;

    // AI-generated explanation
    private String explanation;

    // Why it matches (badges)
    private List<String> matchReasons;
}
