package com.suhada.furniture.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    // Store file and return filename
    String storeFile(MultipartFile file);

    // Load file as resource
    Resource loadFileAsResource(String fileName);

    // Delete file
    void deleteFile(String fileName);

    // Get file URL
    String getFileUrl(String fileName);
}