package com.suhada.furniture.controller;

import com.suhada.furniture.dto.ApiResponse;
import com.suhada.furniture.dto.CreateProductRequest;
import com.suhada.furniture.dto.ProductDTO;
import com.suhada.furniture.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ProductController {

    private final ProductService productService;

    // ============================================================
    // CREATE PRODUCT
    // ============================================================
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(
            @Valid @RequestBody CreateProductRequest request) {

        log.info("📦 Creating product: {}", request.getName());

        ProductDTO product = productService.createProduct(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", product));
    }

    // ============================================================
    // GET ALL PRODUCTS
    // ============================================================
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts() {

        log.info("📋 Fetching all products");

        List<ProductDTO> products = productService.getAllProducts();

        return ResponseEntity.ok(
                ApiResponse.success("Products retrieved successfully", products)
        );
    }

    // ============================================================
    // GET PRODUCT BY ID
    // ============================================================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Long id) {

        log.info("🔍 Fetching product by ID: {}", id);

        ProductDTO product = productService.getProductById(id);

        return ResponseEntity.ok(ApiResponse.success("Product found", product));
    }

    // ============================================================
    // GET PRODUCT BY SKU
    // ============================================================
    @GetMapping("/sku/{sku}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductBySku(@PathVariable String sku) {

        log.info("🔍 Fetching product by SKU: {}", sku);

        ProductDTO product = productService.getProductBySku(sku);

        return ResponseEntity.ok(ApiResponse.success("Product found", product));
    }

    // ============================================================
    // GET PRODUCTS BY CATEGORY
    // ============================================================
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByCategory(
            @PathVariable String category) {

        log.info("📁 Fetching products in category: {}", category);

        List<ProductDTO> products = productService.getProductsByCategory(category);

        return ResponseEntity.ok(
                ApiResponse.success("Products found in category", products)
        );
    }

    // ============================================================
    // SEARCH PRODUCTS
    // ============================================================
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> searchProducts(
            @RequestParam String query) {

        log.info("🔎 Searching for products: {}", query);

        List<ProductDTO> products = productService.searchProducts(query);

        return ResponseEntity.ok(
                ApiResponse.success("Search results", products)
        );
    }

    // ============================================================
    // LOW STOCK PRODUCTS
    // ============================================================
    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getLowStockProducts() {

        log.info("⚠ Fetching low-stock products");

        List<ProductDTO> products = productService.getLowStockProducts();

        return ResponseEntity.ok(
                ApiResponse.success("Low stock products retrieved", products)
        );
    }

    // ============================================================
    // UPDATE PRODUCT
    // ============================================================
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody CreateProductRequest request) {

        log.info("📝 Updating product: {}", id);

        ProductDTO product = productService.updateProduct(id, request);

        return ResponseEntity.ok(
                ApiResponse.success("Product updated successfully", product)
        );
    }

    // ============================================================
    // DELETE PRODUCT
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {

        log.info("🗑️ Deleting product: {}", id);

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                ApiResponse.success("Product deleted successfully", null)
        );
    }

    // ============================================================
    // PAGINATED: GET ALL PRODUCTS
    // ============================================================
    @GetMapping("/paginated")
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> getProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        log.info("📄 Paginated products - page={}, size={}, sortBy={}, sortDir={}",
                page, size, sortBy, sortDir);

        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductDTO> result = productService.getAllProductsPaginated(pageable);

        return ResponseEntity.ok(
                ApiResponse.success("Paginated products retrieved", result)
        );
    }

    // ============================================================
    // PAGINATED SEARCH
    // ============================================================
    @GetMapping("/paginated/search")
    public ResponseEntity<ApiResponse<Page<ProductDTO>>> searchProductsPaginated(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("🔎 Paginated search - query={}, page={}, size={}", query, page, size);

        Pageable pageable = PageRequest.of(page, size);

        Page<ProductDTO> result = productService.searchProductsPaginated(query, pageable);

        return ResponseEntity.ok(
                ApiResponse.success("Paginated search results", result)
        );
    }
}
