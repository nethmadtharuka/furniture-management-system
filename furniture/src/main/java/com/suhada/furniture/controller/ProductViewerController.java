package com.suhada.furniture.controller;

import com.suhada.furniture.entity.Product;
import com.suhada.furniture.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Optional;

/**
 * Controller for serving 3D product viewer HTML pages
 *
 * Routes:
 * - GET /viewer/3d             → Show all products in 3D viewer
 * - GET /viewer/3d/{productId} → Show specific product in 3D viewer
 *
 * These routes return Thymeleaf HTML templates
 */
@Slf4j
@Controller
@RequestMapping("/viewer")
@RequiredArgsConstructor
public class ProductViewerController {

    private final ProductRepository productRepository;

    /**
     * Display all products with 3D viewer
     *
     * GET /viewer/3d
     *
     * Returns: product-viewer.html with all products
     */
    @GetMapping("/3d")
    public String viewAllProducts3D(Model model) {
        try {
            log.info("📺 Request: View all products in 3D");

            // Get all products from database
            List<Product> products = productRepository.findAll();
            log.info("✅ Found {} products", products.size());

            // Add to model for template
            model.addAttribute("products", products);
            model.addAttribute("title", "3D Furniture Viewer - All Products");

            return "product-viewer";
        } catch (Exception e) {
            log.error("❌ Error loading products: {}", e.getMessage());
            model.addAttribute("error", "Failed to load products");
            return "product-viewer";
        }
    }

    /**
     * Display specific product in 3D viewer
     *
     * GET /viewer/3d/{productId}
     *
     * Returns: product-viewer.html with selected product
     */
    @GetMapping("/3d/{productId}")
    public String viewProductAR(@PathVariable Long productId, Model model) {
        try {
            log.info("📱 Request: View AR for product {}", productId);

            // Get product from database
            Optional<Product> productOpt = productRepository.findById(productId);

            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                log.info("✅ Found product: {}", product.getName());

                // Add to model for template
                model.addAttribute("product", product);
                model.addAttribute("productId", productId);
                model.addAttribute("title", product.getName() + " - 3D Viewer");

                // Check if product has 3D model
                if (product.getModel3DUrl() != null) {
                    log.info("✅ Product has 3D model: {}", product.getModel3DUrl());
                    model.addAttribute("has3DModel", true);
                } else {
                    log.warn("⚠️ Product does not have 3D model");
                    model.addAttribute("has3DModel", false);
                }
            } else {
                log.warn("⚠️ Product not found: {}", productId);
                model.addAttribute("error", "Product not found");
            }

            return "product-viewer";
        } catch (Exception e) {
            log.error("❌ Error loading product: {}", e.getMessage());
            model.addAttribute("error", "Failed to load product");
            return "product-viewer";
        }
    }
}