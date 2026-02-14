package com.suhada.furniture.repository;

import com.suhada.furniture.entity.Order;
import com.suhada.furniture.entity.OrderStatus;
import com.suhada.furniture.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByPaymentStatus(PaymentStatus paymentStatus);

    // Find all orders by a specific customer
    List<Order> findByCustomerId(Long customerId);

    // Find orders by customer and status
    List<Order> findByCustomerIdAndStatus(Long customerId, OrderStatus status);

    // Find recent orders
    List<Order> findTop10ByOrderByCreatedAtDesc();

    // Find orders in date range
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Calculate total sales
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED'")
    BigDecimal calculateTotalSales();

    // Count orders by status
    Long countByStatus(OrderStatus status);

    // Find high-value orders
    List<Order> findByTotalAmountGreaterThanEqual(BigDecimal amount);
}