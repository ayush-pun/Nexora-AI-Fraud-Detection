package com.nexora_backend.fraud.rule;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record RuleHit(
        UUID ruleId,
        String ruleCode,
        BigDecimal riskContribution,
        Map<String, Object> details,
        long executionTimeMs
) {}