package com.nexora_backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter @Builder
public class TransactionResponse {
    private UUID id;
    private String transactionReference;
    private String type;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String fraudDecision;
    private BigDecimal newBalanceOrig;
    private String description;
    private Instant createdAt;
    private Instant completedAt;
}