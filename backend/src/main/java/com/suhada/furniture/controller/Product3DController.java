package com.suhada.furniture.controller;

import com.suhada.furniture.dto.ApiResponse;
import com.suhada.furniture.service.Product3DModelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST API Controller for 3D model management
 *
 * Endpoints:
 * - POST   /api/products/3d/{productId}/upload  → Upload 3D model
 * - GET    /api/products/3d/{productId}         → Get 3D model URL
 * - GET    /api/products/3d/{productId}/check   → Check if has 3D model
 * - DELETE /api/products/3d/{productId}         → Delete 3D model
 */
@Slf4j
@RestController
@RequestMapping("/api/products/3d")
@RequiredArgsConstructor
public class Product3DController {

    private final Product3DModelService modelService;

    /**
     * Upload a 3D model for a product
     *
     * POST /api/products/3d/{productId}/upload
     *
     * Form Data:
     *   - file (multipart file): The .glb or .gltf file
     *
     * Example with curl:
     * curl -X POST http://localhost:8080/api/products/3d/1/upload \
     *   -F "file=@model.glb"
     */
    @PostMapping("/{productId}/upload")
    public ResponseEntity<ApiResponse<String>> upload3DModel(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file) {

        try {
            log.info("🚀 API Request: Upload 3D model for product {}", productId);

            // Validate file is present
            if (file.isEmpty()) {
                log.warn("⚠️ File is empty");
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("File is empty. Please select a file."));
            }

            // Call service to upload
            String modelUrl = modelService.upload3DModel(productId, file);

            log.info("✅ API Success: 3D model uploaded successfully");
            return ResponseEntity.ok(
                    ApiResponse.success("3D model uploaded successfully", modelUrl));

        } catch (IllegalArgumentException e) {
            log.error("❌ Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ API Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error("Failed to upload 3D model: " + e.getMessage()));
        }
    }

    /**
     * Get 3D model URL for a product
     *
     * GET /api/products/3d/{productId}
     *
     * Example:
     * curl http://localhost:8080/api/products/3d/1
     *
     * Response:
     * {
     *   "success": true,
     *   "message": "3D model URL retrieved",
     *   "data": "/uploads/3d-models/product_1.glb"
     * }
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<String>> get3DModel(@PathVariable Long productId) {
        try {
            log.info("🔍 API Request: Get 3D model URL for product {}", productId);

            String modelUrl = modelService.get3DModelUrl(productId);

            if (modelUrl == null) {
                log.warn("⚠️ No 3D model found for product {}", productId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ApiResponse.error("No 3D model found for this product"));
            }

            log.info("✅ API Success: Retrieved 3D model URL");
            return ResponseEntity.ok(
                    ApiResponse.success("3D model URL retrieved", modelUrl));

        } catch (Exception e) {
            log.error("❌ API Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error("Failed to fetch 3D model: " + e.getMessage()));
        }
    }

    /**
     * Check if product has 3D model
     *
     * GET /api/products/3d/{productId}/check
     *
     * Example:
     * curl http://localhost:8080/api/products/3d/1/check
     *
     * Response:
     * {
     *   "success": true,
     *   "message": "3D model check completed",
     *   "data": true
     * }
     */
    @GetMapping("/{productId}/check")
    public ResponseEntity<ApiResponse<Boolean>> has3DModel(@PathVariable Long productId) {
        try {
            log.info("🔍 API Request: Check 3D model for product {}", productId);

            boolean has3D = modelService.has3DModel(productId);

            return ResponseEntity.ok(
                    ApiResponse.success(
                            has3D ? "Product has 3D model" : "Product does not have 3D model",
                            has3D));

        } catch (Exception e) {
            log.error("❌ API Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error("Error checking 3D model"));
        }
    }

    /**
     * Delete 3D model for a product
     *
     * DELETE /api/products/3d/{productId}
     *
     * Example:
     * curl -X DELETE http://localhost:8080/api/products/3d/1
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> delete3DModel(@PathVariable Long productId) {
        try {
            log.info("🗑️ API Request: Delete 3D model for product {}", productId);

            modelService.delete3DModel(productId);

            log.info("✅ API Success: 3D model deleted");
            return ResponseEntity.ok(
                    ApiResponse.success("3D model deleted successfully", null));

        } catch (Exception e) {
            log.error("❌ API Error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.error("Failed to delete 3D model: " + e.getMessage()));
        }
    }
}