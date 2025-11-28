package com.suhada.furniture.repository;

import com.suhada.furniture.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find by SKU (unique identifier)
    Optional<Product> findBySku(String sku);

    // Check if SKU exists
    boolean existsBySku(String sku);

    // Find by category
    List<Product> findByCategory(String category);

    // Find low stock products
    List<Product> findByStockQuantityLessThanEqual(Integer quantity);

    // Find products in price range
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Find products by name (partial match, case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Custom query using JPQL (Java Persistence Query Language)
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.reorderLevel")
    List<Product> findLowStockProducts();

    // Custom query with parameters
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.price <= :maxPrice")
    List<Product> findByCategoryAndMaxPrice(
            @Param("category") String category,
            @Param("maxPrice") BigDecimal maxPrice
    );

    // Native SQL query (when you need raw SQL)
    @Query(value = "SELECT * FROM products WHERE stock_quantity > 0 ORDER BY created_at DESC LIMIT 10",
            nativeQuery = true)
    List<Product> findTop10NewProducts();
}