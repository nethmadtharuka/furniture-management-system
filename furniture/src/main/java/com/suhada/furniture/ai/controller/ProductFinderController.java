package com.suhada.furniture.ai.controller;

import com.suhada.furniture.ai.dto.ProductFinderRequest;
import com.suhada.furniture.ai.dto.ProductFinderResponse;
import com.suhada.furniture.ai.service.ProductFinderAIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class ProductFinderController {

    private final ProductFinderAIService productFinderService;

    @PostMapping("/product-finder")
    public ProductFinderResponse findProducts(@RequestBody ProductFinderRequest request) {
        log.info("🔍 AI Product Finder Request: {}", request.getQuery());
        return productFinderService.findProducts(request);
    }
}