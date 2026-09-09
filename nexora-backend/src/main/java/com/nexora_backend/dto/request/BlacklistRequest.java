package com.nexora_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BlacklistRequest {
    @NotBlank private String entityType;          // USER / WALLET / DEVICE / IP_ADDRESS / ACCOUNT
    @NotBlank private String entityValue;
    private String reason;
    private String severity;                      // LOW / MEDIUM / HIGH / CRITICAL
}