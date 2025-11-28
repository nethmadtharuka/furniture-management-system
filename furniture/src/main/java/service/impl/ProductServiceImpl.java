package com.suhada.furniture.service.impl;

import com.suhada.furniture.dto.CreateProductRequest;
import com.suhada.furniture.dto.ProductDTO;
import com.suhada.furniture.entity.Product;
import com.suhada.furniture.exception.BadRequestException;
import com.suhada.furniture.exception.ResourceNotFoundException;
import com.suhada.furniture.repository.ProductRepository;
import com.suhada.furniture.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service  // Tells Spring: "This is a service component"
@RequiredArgsConstructor  // Lombok creates constructor for final fields
@Slf4j  // Lombok creates logger: log.info(), log.error()
public class ProductServiceImpl implements ProductService {

    // Dependencies injected by Spring (via constructor)
    private final ProductRepository productRepository;

    // ============================================================
    // CREATE PRODUCT
    // ============================================================
    @Override
    @Transactional  // If anything fails, rollback database changes
    public ProductDTO createProduct(CreateProductRequest request) {

        log.info("Creating new product with SKU: {}", request.getSku());

        // Step 1: Validate SKU is unique
        if (productRepository.existsBySku(request.getSku())) {
            log.error("Product with SKU {} already exists", request.getSku());
            throw new BadRequestException(
                    "Product with SKU '" + request.getSku() + "' already exists"
            );
        }

        // Step 2: Create Product entity from request
        Product product = Product.builder()
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .costPrice(request.getCostPrice())
                .stockQuantity(request.getStockQuantity())
                .reorderLevel(request.getReorderLevel())
                .category(request.getCategory())
                .build();

        // Step 3: Save to database
        Product savedProduct = productRepository.save(product);

        log.info("Product created successfully with ID: {}", savedProduct.getId());

        // Step 4: Convert Entity to DTO and return
        return mapToDTO(savedProduct);
    }

    // ============================================================
    // GET PRODUCT BY ID
    // ============================================================
    @Override
    public ProductDTO getProductById(Long id) {

        log.info("Fetching product with ID: {}", id);

        // Find product or throw exception
        Product product = productRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Product not found with ID: {}", id);
                    return new ResourceNotFoundException("Product", "id", id);
                });

        return mapToDTO(product);
    }

    // ============================================================
    // GET PRODUCT BY SKU
    // ============================================================
    @Override
    public ProductDTO getProductBySku(String sku) {

        log.info("Fetching product with SKU: {}", sku);

        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> {
                    log.error("Product not found with SKU: {}", sku);
                    return new ResourceNotFoundException("Product", "SKU", sku);
                });

        return mapToDTO(product);
    }

    // ============================================================
    // GET ALL PRODUCTS
    // ============================================================
    @Override
    public List<ProductDTO> getAllProducts() {

        log.info("Fetching all products");

        List<Product> products = productRepository.findAll();

        log.info("Found {} products", products.size());

        // Convert list of entities to list of DTOs
        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET PRODUCTS BY CATEGORY
    // ============================================================
    @Override
    public List<ProductDTO> getProductsByCategory(String category) {

        log.info("Fetching products in category: {}", category);

        List<Product> products = productRepository.findByCategory(category);

        log.info("Found {} products in category {}", products.size(), category);

        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET LOW STOCK PRODUCTS
    // ============================================================
    @Override
    public List<ProductDTO> getLowStockProducts() {

        log.info("Fetching low stock products");

        // Use custom query from repository
        List<Product> products = productRepository.findLowStockProducts();

        log.warn("Found {} products with low stock", products.size());

        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // SEARCH PRODUCTS BY NAME
    // ============================================================
    @Override
    public List<ProductDTO> searchProducts(String query) {

        log.info("Searching products with query: {}", query);

        List<Product> products = productRepository
                .findByNameContainingIgnoreCase(query);

        log.info("Found {} products matching '{}'", products.size(), query);

        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // UPDATE PRODUCT
    // ============================================================
    @Override
    @Transactional
    public ProductDTO updateProduct(Long id, CreateProductRequest request) {

        log.info("Updating product with ID: {}", id);

        // Step 1: Find existing product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        // Step 2: Check if new SKU conflicts with another product
        if (!product.getSku().equals(request.getSku())) {
            if (productRepository.existsBySku(request.getSku())) {
                throw new BadRequestException(
                        "SKU '" + request.getSku() + "' is already in use"
                );
            }
        }

        // Step 3: Update fields
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCostPrice(request.getCostPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setReorderLevel(request.getReorderLevel());
        product.setCategory(request.getCategory());

        // Step 4: Save changes
        Product updatedProduct = productRepository.save(product);

        log.info("Product {} updated successfully", id);

        return mapToDTO(updatedProduct);
    }

    // ============================================================
    // DELETE PRODUCT
    // ============================================================
    @Override
    @Transactional
    public void deleteProduct(Long id) {

        log.info("Deleting product with ID: {}", id);

        // Check if product exists
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }

        // Delete from database
        productRepository.deleteById(id);

        log.info("Product {} deleted successfully", id);
    }

    // ============================================================
    // UPDATE STOCK (Used when order is placed)
    // ============================================================
    @Override
    @Transactional
    public void updateStock(Long productId, Integer quantityChange) {

        log.info("Updating stock for product {}: change = {}",
                productId, quantityChange);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        int newStock = product.getStockQuantity() + quantityChange;

        // Prevent negative stock
        if (newStock < 0) {
            log.error("Insufficient stock for product {}. Available: {}, Requested: {}",
                    productId, product.getStockQuantity(), Math.abs(quantityChange));

            throw new BadRequestException(
                    "Insufficient stock for product '" + product.getName() + "'. " +
                            "Available: " + product.getStockQuantity() +
                            ", Requested: " + Math.abs(quantityChange)
            );
        }

        product.setStockQuantity(newStock);
        productRepository.save(product);

        log.info("Stock updated for product {}. New stock: {}", productId, newStock);

        // Check if stock is low and log warning
        if (product.isLowStock()) {
            log.warn("⚠️ Product '{}' is now low on stock! Current: {}, Reorder level: {}",
                    product.getName(), product.getStockQuantity(), product.getReorderLevel());
        }
    }

    // ============================================================
    // HELPER METHOD: Convert Entity to DTO
    // ============================================================
    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setReorderLevel(product.getReorderLevel());
        dto.setCategory(product.getCategory());
        dto.setImages(product.getImages());
        dto.setLowStock(product.isLowStock());
        dto.setCreatedAt(product.getCreatedAt());

        // Note: We don't include costPrice in DTO (business secret!)

        return dto;
    }
}