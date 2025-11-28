package com.suhada.furniture.dto;

import com.suhada.furniture.entity.OrderStatus;
import com.suhada.furniture.entity.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private CustomerDTO customer;
    private List<OrderItemDTO> items;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String deliveryAddress;
    private LocalDateTime deliveryDate;
    private String notes;
    private LocalDateTime createdAt;
}