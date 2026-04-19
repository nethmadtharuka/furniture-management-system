package com.suhada.furniture.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(
                        "file:" + ensureTrailingSlash(uploadDir)
                );
    }

    private String ensureTrailingSlash(String path) {
        if (path == null || path.isBlank()) return "uploads/";
        return path.endsWith("/") || path.endsWith("\\") ? path : path + "/";
    }
}