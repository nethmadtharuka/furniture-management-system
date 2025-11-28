package com.suhada.furniture.controller;

import com.suhada.furniture.dto.ApiResponse;
import com.suhada.furniture.dto.CreateProductRequest;
import com.suhada.furniture.dto.ProductDTO;
import com.suhada.furniture.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController  // Tells Spring: "This handles HTTP requests"
@RequestMapping("/api/products")  // Base URL for all endpoints
@RequiredArgsConstructor  // Inject dependencies
@CrossOrigin(origins = "*")  // Allow requests from any frontend (CORS)
@Slf4j  // Logging
public class ProductController {

    // Inject ProductService
    private final ProductService productService;

    // ============================================================
    // CREATE PRODUCT - POST /api/products
    // ============================================================
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(
            @Valid @RequestBody CreateProductRequest request) {

        log.info("📦 Received request to create product: {}", request.getName());

        ProductDTO product = productService.createProduct(request);

        log.info("✅ Product created successfully with ID: {}", product.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)  // 201 status code
                .body(ApiResponse.success("Product created successfully", product));
    }

    // ============================================================
    // GET ALL PRODUCTS - GET /api/products
    // ============================================================
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts() {

        log.info("📋 Fetching all products");

        List<ProductDTO> products = productService.getAllProducts();

        log.info("✅ Found {} products", products.size());

        return ResponseEntity.ok(
                ApiResponse.success("Products retrieved successfully", products)
        );
    }

    // ============================================================
    // GET PRODUCT BY ID - GET /api/products/{id}
    // ============================================================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(
            @PathVariable Long id) {

        log.info("🔍 Fetching product with ID: {}", id);

        ProductDTO product = productService.getProductById(id);

        log.info("✅ Product found: {}", product.getName());

        return ResponseEntity.ok(
                ApiResponse.success("Product found", product)
        );
    }

    // ============================================================
    // GET PRODUCT BY SKU - GET /api/products/sku/{sku}
    // ============================================================
    @GetMapping("/sku/{sku}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductBySku(
            @PathVariable String sku) {

        log.info("🔍 Fetching product with SKU: {}", sku);

        ProductDTO product = productService.getProductBySku(sku);

        log.info("✅ Product found: {}", product.getName());

        return ResponseEntity.ok(
                ApiResponse.success("Product found", product)
        );
    }

    // ============================================================
    // GET PRODUCTS BY CATEGORY - GET /api/products/category/{category}
    // ============================================================
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByCategory(
            @PathVariable String category) {

        log.info("📁 Fetching products in category: {}", category);

        List<ProductDTO> products = productService.getProductsByCategory(category);

        log.info("✅ Found {} products in category {}", products.size(), category);

        return ResponseEntity.ok(
                ApiResponse.success("Products found in category", products)
        );
    }

    // ============================================================
    // SEARCH PRODUCTS - GET /api/products/search?query=sofa
    // ============================================================
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> searchProducts(
            @RequestParam String query) {

        log.info("🔎 Searching products with query: {}", query);

        List<ProductDTO> products = productService.searchProducts(query);

        log.info("✅ Found {} products matching '{}'", products.size(), query);

        return ResponseEntity.ok(
                ApiResponse.success("Search results for '" + query + "'", products)
        );
    }

    // ============================================================
    // GET LOW STOCK PRODUCTS - GET /api/products/low-stock
    // ============================================================
    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getLowStockProducts() {

        log.info("⚠️ Fetching low stock products");

        List<ProductDTO> products = productService.getLowStockProducts();

        log.warn("⚠️ Found {} products with low stock", products.size());

        return ResponseEntity.ok(
                ApiResponse.success("Low stock products retrieved", products)
        );
    }

    // ============================================================
    // UPDATE PRODUCT - PUT /api/products/{id}
    // ============================================================
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody CreateProductRequest request) {

        log.info("📝 Updating product with ID: {}", id);

        ProductDTO product = productService.updateProduct(id, request);

        log.info("✅ Product {} updated successfully", id);

        return ResponseEntity.ok(
                ApiResponse.success("Product updated successfully", product)
        );
    }

    // ============================================================
    // DELETE PRODUCT - DELETE /api/products/{id}
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {

        log.info("🗑️ Deleting product with ID: {}", id);

        productService.deleteProduct(id);

        log.info("✅ Product {} deleted successfully", id);

        return ResponseEntity.ok(
                ApiResponse.success("Product deleted successfully", null)
        );
    }
}