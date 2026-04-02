package com.suhada.furniture.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Structured representation of user's search intent
 * Extracted from natural language by AI
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchIntent {

    // Original user query
    private String originalQuery;

    // Extracted category (chair, table, sofa, etc.)
    private String category;

    // Budget constraints
    private Budget budget;

    // Room information
    private Room room;

    // Style preferences (modern, vintage, minimalist)
    private List<String> style;

    // Material preferences (wood, metal, fabric)
    private List<String> materials;

    // Purpose/usage (study, gaming, dining)
    private List<String> purpose;

    // Color preferences
    private List<String> colors;

    // Special features (storage, foldable, adjustable)
    private List<String> features;

    // Missing information that AI needs to ask about
    private List<String> missingInfo;

    /**
     * Budget range
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Budget {
        private Double min;
        private Double max;
        private String currency; // LKR
    }

    /**
     * Room information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Room {
        private String type;  // bedroom, living-room, office, dining
        private String size;  // small, medium, large
    }
}