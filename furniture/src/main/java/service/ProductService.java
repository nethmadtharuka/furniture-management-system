package com.suhada.furniture.service;

import com.suhada.furniture.dto.CreateProductRequest;
import com.suhada.furniture.dto.ProductDTO;

import java.util.List;

public interface ProductService {

    // Create new product
    ProductDTO createProduct(CreateProductRequest request);

    // Get product by ID
    ProductDTO getProductById(Long id);

    // Get product by SKU
    ProductDTO getProductBySku(String sku);

    // Get all products
    List<ProductDTO> getAllProducts();

    // Get products by category
    List<ProductDTO> getProductsByCategory(String category);

    // Get low stock products (for alerts)
    List<ProductDTO> getLowStockProducts();

    // Search products by name
    List<ProductDTO> searchProducts(String query);

    // Update product
    ProductDTO updateProduct(Long id, CreateProductRequest request);

    // Delete product
    void deleteProduct(Long id);

    // Update stock quantity (used when order is placed)
    void updateStock(Long productId, Integer quantityChange);
}