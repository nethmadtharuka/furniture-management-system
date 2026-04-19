package com.suhada.furniture.controller;

import com.suhada.furniture.dto.ApiResponse;
import com.suhada.furniture.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileStorageService fileStorageService;

    // ============================================================
    // UPLOAD FILE - POST /api/files/upload
    // ============================================================
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(
            @RequestParam("file") MultipartFile file) {

        log.info("📤 Received file upload request: {}", file.getOriginalFilename());

        String fileName = fileStorageService.storeFile(file);
        String fileUrl = fileStorageService.getFileUrl(fileName);

        log.info("✅ File uploaded successfully: {}", fileUrl);

        return ResponseEntity.ok(
                ApiResponse.success("File uploaded successfully", fileUrl)
        );
    }

    // ============================================================
    // DOWNLOAD FILE - GET /files/{fileName}
    // ============================================================
    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String fileName,
            HttpServletRequest request) {

        log.info("📥 File download request: {}", fileName);

        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Determine file content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            log.info("Could not determine file type");
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // ============================================================
    // DELETE FILE - DELETE /api/files/{fileName}
    // ============================================================
    @DeleteMapping("/{fileName:.+}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable String fileName) {

        log.info("🗑️ File delete request: {}", fileName);

        fileStorageService.deleteFile(fileName);

        log.info("✅ File deleted successfully: {}", fileName);

        return ResponseEntity.ok(
                ApiResponse.success("File deleted successfully", null)
        );
    }
}