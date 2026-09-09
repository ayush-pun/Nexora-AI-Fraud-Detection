package com.nexora_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CaseResolutionRequest {
    @NotBlank private String resolution;   // CONFIRMED_FRAUD / FALSE_POSITIVE / INCONCLUSIVE
    private String notes;
    private boolean reverseTransaction;     // reverse funds when confirming fraud
}