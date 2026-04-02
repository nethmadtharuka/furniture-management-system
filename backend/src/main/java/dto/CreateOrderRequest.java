package com.suhada.furniture.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid  // This validates each item in the list!
    private List<OrderItemRequest> items;

    @Size(max = 500, message = "Delivery address too long")
    private String deliveryAddress;

    @Size(max = 1000, message = "Notes too long")
    private String notes;
}