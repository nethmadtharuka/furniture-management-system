package com.suhada.furniture.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductDTO {
    private Long id;
    private String sku;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Integer reorderLevel;
    private String category;
    private List<String> images;
    private boolean lowStock;  // Computed field
    private LocalDateTime createdAt;

    // Note: We don't expose costPrice (business secret!)
}