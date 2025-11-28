package com.suhada.furniture.service.impl;

import com.suhada.furniture.dto.*;
import com.suhada.furniture.entity.*;
import com.suhada.furniture.exception.BadRequestException;
import com.suhada.furniture.exception.InsufficientStockException;
import com.suhada.furniture.exception.ResourceNotFoundException;
import com.suhada.furniture.repository.*;
import com.suhada.furniture.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    // ============================================================
    // CREATE ORDER - THE MAIN BUSINESS LOGIC!
    // ============================================================
    @Override
    @Transactional  // CRITICAL: Everything must succeed or rollback!
    public OrderDTO createOrder(CreateOrderRequest request) {

        log.info("Creating new order for customer ID: {}", request.getCustomerId());

        // ========== STEP 1: VALIDATE CUSTOMER ==========
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> {
                    log.error("Customer not found with ID: {}", request.getCustomerId());
                    return new ResourceNotFoundException("Customer", "id", request.getCustomerId());
                });

        log.info("Customer found: {}", customer.getFullName());

        // ========== STEP 2: CREATE ORDER ENTITY ==========
        Order order = Order.builder()
                .customer(customer)
                .deliveryAddress(request.getDeliveryAddress())
                .notes(request.getNotes())
                .orderItems(new ArrayList<>())  // Initialize empty list
                .build();

        // Note: orderNumber, status, paymentStatus set automatically by @PrePersist

        log.info("Order entity created with number: {}", order.getOrderNumber());

        // ========== STEP 3: PROCESS EACH ORDER ITEM ==========
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {

            log.info("Processing item: productId={}, quantity={}",
                    itemRequest.getProductId(), itemRequest.getQuantity());

            // Find product
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> {
                        log.error("Product not found with ID: {}", itemRequest.getProductId());
                        return new ResourceNotFoundException("Product", "id", itemRequest.getProductId());
                    });

            log.info("Product found: {} (Stock: {})",
                    product.getName(), product.getStockQuantity());

            // Check stock availability
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                log.error("Insufficient stock for product {}. Available: {}, Requested: {}",
                        product.getName(), product.getStockQuantity(), itemRequest.getQuantity());

                throw new InsufficientStockException(
                        product.getName(),
                        product.getStockQuantity(),
                        itemRequest.getQuantity()
                );
            }

            // Calculate prices for this item
            BigDecimal unitPrice = product.getPrice();
            BigDecimal itemTotal = unitPrice.multiply(new BigDecimal(itemRequest.getQuantity()));

            log.info("Item pricing: unitPrice={}, quantity={}, itemTotal={}",
                    unitPrice, itemRequest.getQuantity(), itemTotal);

            // Create order item
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(itemTotal)
                    .build();

            // Add to order
            order.getOrderItems().add(orderItem);

            // Add to running total
            totalAmount = totalAmount.add(itemTotal);

            // ========== REDUCE STOCK ==========
            int newStock = product.getStockQuantity() - itemRequest.getQuantity();
            product.setStockQuantity(newStock);
            productRepository.save(product);

            log.info("Stock reduced for product {}. New stock: {}",
                    product.getName(), newStock);

            // Warn if stock is now low
            if (product.isLowStock()) {
                log.warn("⚠️ ALERT: Product '{}' is now LOW ON STOCK! Current: {}, Reorder level: {}",
                        product.getName(), product.getStockQuantity(), product.getReorderLevel());
            }
        }

        // ========== STEP 4: SET TOTAL AMOUNT ==========
        order.setTotalAmount(totalAmount);

        log.info("Order total calculated: Rs. {}", totalAmount);

        // ========== STEP 5: SAVE ORDER ==========
        Order savedOrder = orderRepository.save(order);

        log.info("✅ Order saved successfully! Order ID: {}, Order Number: {}, Total: Rs. {}",
                savedOrder.getId(), savedOrder.getOrderNumber(), savedOrder.getTotalAmount());

        // ========== STEP 6: SEND NOTIFICATIONS ==========
        // TODO: We'll implement these later!
        // sendWhatsAppNotification(savedOrder);
        // sendEmailNotification(savedOrder);
        // sendRealtimeNotification(savedOrder);

        log.info("Order notifications would be sent here (not implemented yet)");

        // ========== STEP 7: RETURN ORDER DTO ==========
        return mapToDTO(savedOrder);
    }

    // ============================================================
    // GET ORDER BY ID
    // ============================================================
    @Override
    public OrderDTO getOrderById(Long id) {

        log.info("Fetching order with ID: {}", id);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Order not found with ID: {}", id);
                    return new ResourceNotFoundException("Order", "id", id);
                });

        return mapToDTO(order);
    }

    // ============================================================
    // GET ORDER BY ORDER NUMBER
    // ============================================================
    @Override
    public OrderDTO getOrderByOrderNumber(String orderNumber) {

        log.info("Fetching order with number: {}", orderNumber);

        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> {
                    log.error("Order not found with number: {}", orderNumber);
                    return new ResourceNotFoundException("Order", "orderNumber", orderNumber);
                });

        return mapToDTO(order);
    }

    // ============================================================
    // GET ALL ORDERS
    // ============================================================
    @Override
    public List<OrderDTO> getAllOrders() {

        log.info("Fetching all orders");

        List<Order> orders = orderRepository.findAll();

        log.info("Found {} orders", orders.size());

        return orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET ORDERS BY CUSTOMER
    // ============================================================
    @Override
    public List<OrderDTO> getOrdersByCustomerId(Long customerId) {

        log.info("Fetching orders for customer ID: {}", customerId);

        // Verify customer exists
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer", "id", customerId);
        }

        List<Order> orders = orderRepository.findByCustomerId(customerId);

        log.info("Found {} orders for customer {}", orders.size(), customerId);

        return orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET ORDERS BY STATUS
    // ============================================================
    @Override
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {

        log.info("Fetching orders with status: {}", status);

        List<Order> orders = orderRepository.findByStatus(status);

        log.info("Found {} orders with status {}", orders.size(), status);

        return orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET RECENT ORDERS
    // ============================================================
    @Override
    public List<OrderDTO> getRecentOrders(int limit) {

        log.info("Fetching {} most recent orders", limit);

        List<Order> orders = orderRepository.findTop10ByOrderByCreatedAtDesc();

        return orders.stream()
                .limit(limit)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // UPDATE ORDER STATUS
    // ============================================================
    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus newStatus) {

        log.info("Updating order {} status to {}", orderId, newStatus);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        Order updatedOrder = orderRepository.save(order);

        log.info("Order {} status updated from {} to {}",
                orderId, oldStatus, newStatus);

        // Send notification about status change
        // TODO: sendStatusChangeNotification(updatedOrder, oldStatus, newStatus);

        return mapToDTO(updatedOrder);
    }

    // ============================================================
    // CANCEL ORDER
    // ============================================================
    @Override
    @Transactional
    public OrderDTO cancelOrder(Long orderId) {

        log.info("Cancelling order: {}", orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Can only cancel pending or confirmed orders
        if (order.getStatus() == OrderStatus.SHIPPED ||
                order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException(
                    "Cannot cancel order that is already " + order.getStatus()
            );
        }

        // Return stock to inventory
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            int returnedStock = product.getStockQuantity() + item.getQuantity();
            product.setStockQuantity(returnedStock);
            productRepository.save(product);

            log.info("Returned {} units of {} to stock. New stock: {}",
                    item.getQuantity(), product.getName(), returnedStock);
        }

        // Update order status
        order.setStatus(OrderStatus.CANCELLED);
        Order cancelledOrder = orderRepository.save(order);

        log.info("✅ Order {} cancelled successfully", orderId);

        // TODO: sendCancellationNotification(cancelledOrder);

        return mapToDTO(cancelledOrder);
    }

    // ============================================================
    // GET ORDERS BY DATE RANGE
    // ============================================================
    @Override
    public List<OrderDTO> getOrdersByDateRange(LocalDateTime start, LocalDateTime end) {

        log.info("Fetching orders between {} and {}", start, end);

        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);

        log.info("Found {} orders in date range", orders.size());

        return orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // HELPER METHODS
    // ============================================================

    // Convert Order Entity to OrderDTO
    private OrderDTO mapToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCustomer(mapCustomerToDTO(order.getCustomer()));
        dto.setItems(mapOrderItemsToDTO(order.getOrderItems()));
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setNotes(order.getNotes());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }

    // Convert Customer Entity to CustomerDTO
    private CustomerDTO mapCustomerToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFullName(customer.getFullName());
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setWhatsappNumber(customer.getWhatsappNumber());
        dto.setCreatedAt(customer.getCreatedAt());
        return dto;
    }

    // Convert list of OrderItem entities to OrderItemDTOs
    private List<OrderItemDTO> mapOrderItemsToDTO(List<OrderItem> orderItems) {
        return orderItems.stream()
                .map(this::mapOrderItemToDTO)
                .collect(Collectors.toList());
    }

    // Convert OrderItem Entity to OrderItemDTO
    private OrderItemDTO mapOrderItemToDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setProductId(orderItem.getProduct().getId());
        dto.setProductName(orderItem.getProduct().getName());
        dto.setProductSku(orderItem.getProduct().getSku());
        dto.setQuantity(orderItem.getQuantity());
        dto.setUnitPrice(orderItem.getUnitPrice());
        dto.setTotalPrice(orderItem.getTotalPrice());
        return dto;
    }
}