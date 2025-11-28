package com.suhada.furniture.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrderItemRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 100, message = "Cannot order more than 100 units at once")
    private Integer quantity;
}