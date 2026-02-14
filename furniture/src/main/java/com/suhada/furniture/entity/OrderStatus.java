package com.suhada.furniture.entity;

public enum OrderStatus {
    PENDING,        // Just created
    CONFIRMED,      // Admin confirmed
    PROCESSING,     // Being prepared
    SHIPPED,        // Out for delivery
    DELIVERED,      // Customer received
    CANCELLED       // Order cancelled
}