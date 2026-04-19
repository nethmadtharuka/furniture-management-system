package com.suhada.furniture.service;

import com.suhada.furniture.entity.Product;
import com.suhada.furniture.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

/**
 * Service to handle 3D model uploads and management
 *
 * Responsibilities:
 * 1. Upload GLB/GLTF files to server
 * 2. Update Product entity with model URL
 * 3. Retrieve model URLs for products
 * 4. Check if product has 3D model
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Product3DModelService {

    private final ProductRepository productRepository;

    // This matches your application.properties: file.upload-dir=uploads
    @Value("${file.upload-dir:uploads}")
    private String baseUploadDir;

    @Value("${file.base-url:}")
    private String fileBaseUrl;

    /**
     * Upload a 3D model file (GLB/GLTF format)
     *
     * @param productId The product to attach the model to
     * @param file The GLB/GLTF file
     * @return The URL to the uploaded model
     */
    public String upload3DModel(Long productId, MultipartFile file) {
        try {
            log.info(" Starting 3D model upload for product: {}", productId);

            // ============================================================
            // STEP 1: Validate file type
            // ============================================================
            String fileName = file.getOriginalFilename();
            if (fileName == null || (!fileName.endsWith(".glb") && !fileName.endsWith(".gltf"))) {
                throw new IllegalArgumentException(
                        " Only .glb and .gltf files are supported. Received: " + fileName);
            }
            log.info(" File validation passed: {}", fileName);

            // ============================================================
            // STEP 2: Create 3d-models directory if it doesn't exist
            // ============================================================
            Path modelDir = Paths.get(baseUploadDir, "3d-models");
            if (!Files.exists(modelDir)) {
                Files.createDirectories(modelDir);
                log.info(" Created directory: {}", modelDir.toAbsolutePath());
            }

            // ============================================================
            // STEP 3: Save file with product ID as name
            // ============================================================
            String sha256 = sha256Hex(file.getInputStream());
            String newFileName = "product_" + productId + "_" + sha256.substring(0, 12) + ".glb";
            Path filePath = modelDir.resolve(newFileName);

            // Copy file from multipart to disk
            Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            log.info(" File saved to: {}", filePath.toAbsolutePath());

            // ============================================================
            // STEP 4: Update Product entity with model URL
            // ============================================================
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                String relativeUrl = "/uploads/3d-models/" + newFileName;
                String modelUrl = buildPublicUrl(relativeUrl);
                product.setModel3DUrl(modelUrl);
                productRepository.save(product);
                log.info(" Product {} updated with 3D model URL: {}", productId, modelUrl);
                return modelUrl;
            }

            throw new RuntimeException(" Product not found with ID: " + productId);

        } catch (IOException e) {
            log.error(" IO Error uploading 3D model: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload 3D model: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error(" Unexpected error uploading 3D model: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload 3D model: " + e.getMessage(), e);
        }
    }

    private String buildPublicUrl(String relativeUrl) {
        if (relativeUrl == null) return null;
        String base = (fileBaseUrl == null) ? "" : fileBaseUrl.trim();
        if (base.isBlank()) return relativeUrl;
        base = base.replaceAll("/+$", "");
        return base + relativeUrl;
    }

    private String sha256Hex(InputStream in) throws IOException {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] buf = new byte[8192];
            int r;
            while ((r = in.read(buf)) != -1) {
                md.update(buf, 0, r);
            }
            byte[] digest = md.digest();
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        } finally {
            in.close();
        }
    }

    /**
     * Get 3D model URL for a product
     *
     * @param productId The product ID
     * @return The URL to the 3D model, or null if not found
     */
    public String get3DModelUrl(Long productId) {
        try {
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                String modelUrl = productOpt.get().getModel3DUrl();
                log.info(" Retrieved 3D model URL for product {}: {}", productId, modelUrl);
                return modelUrl;
            }
            log.warn("⚠️ Product not found: {}", productId);
            return null;
        } catch (Exception e) {
            log.error(" Error retrieving 3D model URL: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Check if product has 3D model
     *
     * @param productId The product ID
     * @return true if product has a 3D model, false otherwise
     */
    public boolean has3DModel(Long productId) {
        try {
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                boolean has3D = productOpt.get().getModel3DUrl() != null;
                log.info("🔍 Product {} has 3D model: {}", productId, has3D);
                return has3D;
            }
            return false;
        } catch (Exception e) {
            log.error(" Error checking 3D model: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Delete 3D model for a product
     *
     * @param productId The product ID
     */
    public void delete3DModel(Long productId) {
        try {
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                String modelUrl = product.getModel3DUrl();

                if (modelUrl != null) {
                    // Delete file from disk
                    // Best-effort: remove the file referenced by URL if it maps to our /uploads path.
                    int idx = modelUrl.lastIndexOf('/');
                    String fileName = idx >= 0 ? modelUrl.substring(idx + 1) : modelUrl;
                    Path filePath = Paths.get(baseUploadDir, "3d-models", fileName);
                    if (Files.exists(filePath)) {
                        Files.delete(filePath);
                        log.info("✅ Deleted 3D model file: {}", filePath);
                    }

                    // Remove URL from Product
                    product.setModel3DUrl(null);
                    productRepository.save(product);
                    log.info("✅ Removed 3D model URL from product: {}", productId);
                }
            }
        } catch (IOException e) {
            log.error("❌ Error deleting 3D model: {}", e.getMessage());
        }
    }
}