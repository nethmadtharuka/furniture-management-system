package com.suhada.furniture.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateProductRequest {

    @NotBlank(message = "SKU is required")
    @Pattern(regexp = "^[A-Z0-9]{3,20}$", message = "SKU must be 3-20 uppercase letters/numbers")
    private String sku;

    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 200, message = "Name must be between 3 and 200 characters")
    private String name;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @DecimalMax(value = "99999999.99", message = "Price is too high")
    private BigDecimal price;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.01", message = "Cost price must be greater than 0")
    private BigDecimal costPrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    @Max(value = 99999, message = "Stock quantity is too high")
    private Integer stockQuantity;

    @NotNull(message = "Reorder level is required")
    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;

    @Size(max = 50, message = "Category name too long")
    private String category;
}