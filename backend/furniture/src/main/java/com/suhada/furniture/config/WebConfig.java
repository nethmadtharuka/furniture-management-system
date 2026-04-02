package com.suhada.furniture.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Normalize path for both Windows (local) and Linux (Azure)
        String location = uploadDir.startsWith("/")
                ? "file:" + uploadDir + "/"        // Linux: /home/uploads/
                : "file:" + uploadDir + "/";        // Windows: uploads/

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}