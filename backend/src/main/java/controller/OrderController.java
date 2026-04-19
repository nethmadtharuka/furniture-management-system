package com.suhada.furniture.controller;

import com.suhada.furniture.dto.ApiResponse;
import com.suhada.furniture.dto.CreateOrderRequest;
import com.suhada.furniture.dto.OrderDTO;
import com.suhada.furniture.entity.OrderStatus;
import com.suhada.furniture.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    // ============================================================
    // CREATE ORDER - POST /api/orders
    // ============================================================
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {

        log.info("🛒 Received order request for customer ID: {}", request.getCustomerId());
        log.info("📦 Order contains {} items", request.getItems().size());

        OrderDTO order = orderService.createOrder(request);

        log.info("✅ Order created successfully! Order Number: {}, Total: Rs. {}",
                order.getOrderNumber(), order.getTotalAmount());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", order));
    }

    // ============================================================
    // GET ALL ORDERS - GET /api/orders
    // ============================================================
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllOrders() {

        log.info("📋 Fetching all orders");

        List<OrderDTO> orders = orderService.getAllOrders();

        log.info("✅ Found {} orders", orders.size());

        return ResponseEntity.ok(
                ApiResponse.success("Orders retrieved successfully", orders)
        );
    }

    // ============================================================
    // GET ORDER BY ID - GET /api/orders/{id}
    // ============================================================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderById(@PathVariable Long id) {

        log.info("🔍 Fetching order with ID: {}", id);

        OrderDTO order = orderService.getOrderById(id);

        log.info("✅ Order found: {}", order.getOrderNumber());

        return ResponseEntity.ok(
                ApiResponse.success("Order found", order)
        );
    }

    // ============================================================
    // GET ORDER BY ORDER NUMBER - GET /api/orders/number/{orderNumber}
    // ============================================================
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderByOrderNumber(
            @PathVariable String orderNumber) {

        log.info("🔍 Fetching order with number: {}", orderNumber);

        OrderDTO order = orderService.getOrderByOrderNumber(orderNumber);

        log.info("✅ Order found: {}", orderNumber);

        return ResponseEntity.ok(
                ApiResponse.success("Order found", order)
        );
    }

    // ============================================================
    // GET ORDERS BY CUSTOMER - GET /api/orders/customer/{customerId}
    // ============================================================
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByCustomer(
            @PathVariable Long customerId) {

        log.info("👤 Fetching orders for customer ID: {}", customerId);

        List<OrderDTO> orders = orderService.getOrdersByCustomerId(customerId);

        log.info("✅ Found {} orders for customer {}", orders.size(), customerId);

        return ResponseEntity.ok(
                ApiResponse.success("Customer orders retrieved", orders)
        );
    }

    // ============================================================
    // GET ORDERS BY STATUS - GET /api/orders/status/{status}
    // ============================================================
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByStatus(
            @PathVariable OrderStatus status) {

        log.info("📊 Fetching orders with status: {}", status);

        List<OrderDTO> orders = orderService.getOrdersByStatus(status);

        log.info("✅ Found {} orders with status {}", orders.size(), status);

        return ResponseEntity.ok(
                ApiResponse.success("Orders with status " + status, orders)
        );
    }

    // ============================================================
    // GET RECENT ORDERS - GET /api/orders/recent?limit=10
    // ============================================================
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getRecentOrders(
            @RequestParam(defaultValue = "10") int limit) {

        log.info("🕐 Fetching {} most recent orders", limit);

        List<OrderDTO> orders = orderService.getRecentOrders(limit);

        log.info("✅ Retrieved {} recent orders", orders.size());

        return ResponseEntity.ok(
                ApiResponse.success("Recent orders retrieved", orders)
        );
    }

    // ============================================================
    // UPDATE ORDER STATUS - PATCH /api/orders/{id}/status
    // ============================================================
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {

        log.info("📝 Updating order {} status to {}", id, status);

        OrderDTO order = orderService.updateOrderStatus(id, status);

        log.info("✅ Order {} status updated to {}", id, status);

        return ResponseEntity.ok(
                ApiResponse.success("Order status updated to " + status, order)
        );
    }

    // ============================================================
    // CANCEL ORDER - POST /api/orders/{id}/cancel
    // ============================================================
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderDTO>> cancelOrder(@PathVariable Long id) {

        log.info("❌ Cancelling order: {}", id);

        OrderDTO order = orderService.cancelOrder(id);

        log.info("✅ Order {} cancelled successfully", id);

        return ResponseEntity.ok(
                ApiResponse.success("Order cancelled successfully", order)
        );
    }

    // ============================================================
    // GET ORDERS BY DATE RANGE - GET /api/orders/date-range
    // ============================================================
    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        log.info("📅 Fetching orders between {} and {}", start, end);

        List<OrderDTO> orders = orderService.getOrdersByDateRange(start, end);

        log.info("✅ Found {} orders in date range", orders.size());

        return ResponseEntity.ok(
                ApiResponse.success("Orders in date range", orders)
        );
    }
}