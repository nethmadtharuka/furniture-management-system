package com.suhada.furniture.service;

import com.suhada.furniture.dto.CreateOrderRequest;
import com.suhada.furniture.dto.OrderDTO;
import com.suhada.furniture.entity.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {

    // Create new order
    OrderDTO createOrder(CreateOrderRequest request);

    // Get order by ID
    OrderDTO getOrderById(Long id);

    // Get order by order number
    OrderDTO getOrderByOrderNumber(String orderNumber);

    // Get all orders
    List<OrderDTO> getAllOrders();

    // Get orders by customer
    List<OrderDTO> getOrdersByCustomerId(Long customerId);

    // Get orders by status
    List<OrderDTO> getOrdersByStatus(OrderStatus status);

    // Get recent orders
    List<OrderDTO> getRecentOrders(int limit);

    // Update order status
    OrderDTO updateOrderStatus(Long orderId, OrderStatus newStatus);

    // Cancel order
    OrderDTO cancelOrder(Long orderId);

    // Get orders in date range
    List<OrderDTO> getOrdersByDateRange(LocalDateTime start, LocalDateTime end);
}