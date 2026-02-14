package com.suhada.furniture.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;  // Stock Keeping Unit (like: SOFA001)

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;  // Selling price

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal costPrice;  // How much it costs you

    @Column(nullable = false)
    private Integer stockQuantity;  // How many in stock

    @Column(nullable = false)
    private Integer reorderLevel;  // Alert when stock below this

    private String category;  // e.g., "Living Room", "Bedroom"

    @ElementCollection
    @CollectionTable(name = "product_images",
            joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();  // Multiple images

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper method to check if stock is low
    public boolean isLowStock() {
        return stockQuantity <= reorderLevel;
    }
}