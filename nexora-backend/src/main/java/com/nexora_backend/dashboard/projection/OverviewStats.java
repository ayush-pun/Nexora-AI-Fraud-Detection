package com.nexora_backend.dashboard.projection;

import java.math.BigDecimal;

public interface OverviewStats {
    long getTotalUsers();
    long getTotalTransactions();
    long getFlaggedTransactions();     // REVIEW + BLOCK
    long getBlockedTransactions();
    long getOpenCases();
    BigDecimal getTotalVolume();
}
