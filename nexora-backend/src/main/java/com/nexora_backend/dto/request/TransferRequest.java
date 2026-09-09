package com.nexora_backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter @Setter
public class TransferRequest {
    @NotBlank(message = "Destination wallet number is required")
    private String destinationWalletNumber;

    @NotNull @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Digits(integer = 15, fraction = 4)
    private BigDecimal amount;

    @Size(max = 255)
    private String description;
}