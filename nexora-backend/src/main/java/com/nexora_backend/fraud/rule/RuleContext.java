package com.nexora_backend.fraud.rule;

import com.nexora_backend.entity.Transaction;
import com.nexora_backend.entity.User;
import com.nexora_backend.enums.TransactionType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

// everything a rule might need about the transaction being scored
public record RuleContext(
        UUID userId, Instant userCreatedAt, UUID walletId,
        TransactionType type, BigDecimal amount, BigDecimal oldBalanceOrig,
        int hour, String ipAddress, UUID deviceId) {

    public static RuleContext from(Transaction tx, User user) {
        return new RuleContext(
                user.getId(), user.getCreatedAt(), tx.getWallet().getId(),
                tx.getType(), tx.getAmount(), tx.getOldBalanceOrig(),
                tx.getStep() != null ? tx.getStep() : 0, tx.getIpAddress(), tx.getDeviceId());
    }
}