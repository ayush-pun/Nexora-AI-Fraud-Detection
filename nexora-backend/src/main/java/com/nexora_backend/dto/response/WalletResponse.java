package com.nexora_backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.util.UUID;

@Getter @Builder
public class WalletResponse {
    private UUID id;
    private String walletNumber;
    private BigDecimal balance;
    private String currency;
    private String status;
}