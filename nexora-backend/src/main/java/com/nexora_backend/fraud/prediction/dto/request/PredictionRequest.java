package com.nexora_backend.fraud.prediction.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record PredictionRequest(
        String type,                                              // domain type; Python maps it
        BigDecimal amount,
        @JsonProperty("old_balance_orig") BigDecimal oldBalanceOrig,
        @JsonProperty("new_balance_orig") BigDecimal newBalanceOrig,
        @JsonProperty("old_balance_dest") BigDecimal oldBalanceDest,
        @JsonProperty("new_balance_dest") BigDecimal newBalanceDest,
        Integer step,
        @JsonProperty("rule_risk_score") BigDecimal ruleRiskScore,
        boolean explain,
        @JsonProperty("transaction_reference") String transactionReference
) {}