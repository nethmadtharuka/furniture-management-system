package com.suhada.furniture.service.impl;

import com.suhada.furniture.config.FileStorageProperties;
import com.suhada.furniture.exception.BadRequestException;
import com.suhada.furniture.exception.ResourceNotFoundException;
import com.suhada.furniture.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;
    private final String baseUrl;

    @Autowired
    public FileStorageServiceImpl(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();
        this.baseUrl = fileStorageProperties.getBaseUrl();

        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("📁 File storage directory created at: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    // ============================================================
    // STORE FILE
    // ============================================================
    @Override
    public String storeFile(MultipartFile file) {

        // Validate file
        if (file.isEmpty()) {
            throw new BadRequestException("Cannot upload empty file");
        }

        // Get original filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        log.info("📤 Uploading file: {}", originalFilename);

        try {
            // Check for invalid characters
            if (originalFilename.contains("..")) {
                throw new BadRequestException("Invalid file path: " + originalFilename);
            }

            // Generate unique filename
            String fileExtension = getFileExtension(originalFilename);
            String newFileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to storage location
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("✅ File uploaded successfully: {}", newFileName);

            return newFileName;

        } catch (IOException ex) {
            log.error("❌ Failed to store file: {}", originalFilename, ex);
            throw new RuntimeException("Could not store file " + originalFilename, ex);
        }
    }

    // ============================================================
    // LOAD FILE AS RESOURCE
    // ============================================================
    @Override
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found: " + fileName);
        }
    }

    // ============================================================
    // DELETE FILE
    // ============================================================
    @Override
    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
            log.info("🗑️ File deleted: {}", fileName);
        } catch (IOException ex) {
            log.error("❌ Failed to delete file: {}", fileName, ex);
            throw new RuntimeException("Could not delete file: " + fileName, ex);
        }
    }

    // ============================================================
    // GET FILE URL
    // ============================================================
    @Override
    public String getFileUrl(String fileName) {
        return baseUrl + "/" + fileName;
    }

    // ============================================================
    // HELPER METHODS
    // ============================================================

    private String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex);
    }
}