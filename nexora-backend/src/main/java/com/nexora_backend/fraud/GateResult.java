package com.nexora_backend.fraud;

import com.nexora_backend.enums.FraudDecision;
import java.math.BigDecimal;

public record GateResult(FraudDecision decision, BigDecimal hybridScore) {}