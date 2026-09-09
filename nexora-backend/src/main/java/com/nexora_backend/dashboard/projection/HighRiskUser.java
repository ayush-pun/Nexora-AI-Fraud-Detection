package com.nexora_backend.dashboard.projection;

import java.math.BigDecimal;

public interface HighRiskUser {
    java.util.UUID getUserId();
    String getUsername();
    long getFlaggedCount();
    BigDecimal getMaxRisk();
}