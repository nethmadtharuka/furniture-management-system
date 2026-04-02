package com.suhada.furniture.repository;

import com.suhada.furniture.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    boolean existsBySku(String sku);

    List<Product> findByCategory(String category);

    List<Product> findByStockQuantityLessThanEqual(Integer quantity);

    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.reorderLevel")
    List<Product> findLowStockProducts();

    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.price <= :maxPrice")
    List<Product> findByCategoryAndMaxPrice(
            @Param("category") String category,
            @Param("maxPrice") BigDecimal maxPrice
    );

    @Query(value = "SELECT * FROM products WHERE stock_quantity > 0 ORDER BY created_at DESC LIMIT 10",
            nativeQuery = true)
    List<Product> findTop10NewProducts();

    // ============================================================
    // PAGINATION METHODS - NEW!
    // ============================================================

    // 1. Get all products with pagination
    Page<Product> findAll(Pageable pageable);

    // 2. Search by name with pagination
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // 3. Filter by category with pagination
    Page<Product> findByCategory(String category, Pageable pageable);

    // 4. Filter by price range with pagination
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
}
