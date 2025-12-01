package com.suhada.furniture.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIQueryResponse {
    private String response;
    private String model;
    private Integer tokensUsed;
}