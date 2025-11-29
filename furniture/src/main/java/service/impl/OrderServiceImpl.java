package com.suhada.furniture.service.impl;

import com.suhada.furniture.dto.*;
import com.suhada.furniture.entity.*;
import com.suhada.furniture.exception.BadRequestException;
import com.suhada.furniture.exception.InsufficientStockException;
import com.suhada.furniture.exception.ResourceNotFoundException;
import com.suhada.furniture.repository.*;
import com.suhada.furniture.service.OrderService;
import com.suhada.furniture.service.EmailService;
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
    private final EmailService emailService;

    // ============================================================
    // CREATE ORDER
    // ============================================================
    @Override
    @Transactional
    public OrderDTO createOrder(CreateOrderRequest request) {

        log.info("Creating new order for customer ID: {}", request.getCustomerId());

        // -------- STEP 1: VALIDATE CUSTOMER --------
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));

        // -------- STEP 2: CREATE ORDER --------
        Order order = Order.builder()
                .customer(customer)
                .deliveryAddress(request.getDeliveryAddress())
                .notes(request.getNotes())
                .orderItems(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        // -------- STEP 3: PROCESS ITEMS --------
        for (OrderItemRequest itemRequest : request.getItems()) {

            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemRequest.getProductId()));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new InsufficientStockException(
                        product.getName(),
                        product.getStockQuantity(),
                        itemRequest.getQuantity()
                );
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal itemTotal = unitPrice.multiply(new BigDecimal(itemRequest.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(itemTotal)
                    .build();

            order.getOrderItems().add(orderItem);

            // Stock reduce
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            totalAmount = totalAmount.add(itemTotal);
        }

        // -------- STEP 4: SAVE ORDER --------
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        log.info("✅ Order saved successfully! Order ID: {}, Order Number: {}",
                savedOrder.getId(), savedOrder.getOrderNumber());

        // -------- STEP 5: SEND EMAIL NOTIFICATION --------
        emailService.sendOrderConfirmationEmail(savedOrder);

        return mapToDTO(savedOrder);
    }

    // ============================================================
    // GET ORDER BY ID
    // ============================================================
    @Override
    public OrderDTO getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        return mapToDTO(order);
    }

    // ============================================================
    // GET ORDER BY ORDER NUMBER
    // ============================================================
    @Override
    public OrderDTO getOrderByOrderNumber(String orderNumber) {

        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));

        return mapToDTO(order);
    }

    // ============================================================
    // GET ALL ORDERS
    // ============================================================
    @Override
    public List<OrderDTO> getAllOrders() {

        return orderRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET ORDERS BY CUSTOMER
    // ============================================================
    @Override
    public List<OrderDTO> getOrdersByCustomerId(Long customerId) {

        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer", "id", customerId);
        }

        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET ORDERS BY STATUS
    // ============================================================
    @Override
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {

        return orderRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // RECENT ORDERS
    // ============================================================
    @Override
    public List<OrderDTO> getRecentOrders(int limit) {

        return orderRepository.findTop10ByOrderByCreatedAtDesc().stream()
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

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        Order updatedOrder = orderRepository.save(order);

        // Send update email
        emailService.sendOrderStatusUpdateEmail(updatedOrder, oldStatus.name(), newStatus.name());

        return mapToDTO(updatedOrder);
    }

    // ============================================================
    // CANCEL ORDER
    // ============================================================
    @Override
    @Transactional
    public OrderDTO cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (order.getStatus() == OrderStatus.SHIPPED ||
                order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel order already " + order.getStatus());
        }

        // Return stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order cancelledOrder = orderRepository.save(order);

        return mapToDTO(cancelledOrder);
    }

    // ============================================================
    // BY DATE RANGE
    // ============================================================
    @Override
    public List<OrderDTO> getOrdersByDateRange(LocalDateTime start, LocalDateTime end) {

        return orderRepository.findByCreatedAtBetween(start, end)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // HELPER MAPPERS
    // ============================================================
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

    private List<OrderItemDTO> mapOrderItemsToDTO(List<OrderItem> items) {
        return items.stream()
                .map(this::mapOrderItemToDTO)
                .collect(Collectors.toList());
    }

    private OrderItemDTO mapOrderItemToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductSku(item.getProduct().getSku());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        return dto;
    }
}