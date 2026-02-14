package com.suhada.furniture.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;  // Price at time of order

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;  // quantity × unitPrice

    @PrePersist
    @PreUpdate
    protected void calculateTotalPrice() {
        if (unitPrice != null && quantity != null) {
            this.totalPrice = unitPrice.multiply(new BigDecimal(quantity));
        }
    }
}