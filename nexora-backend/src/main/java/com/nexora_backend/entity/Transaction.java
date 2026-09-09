package com.nexora_backend.entity;

import com.nexora_backend.enums.Currency;
import com.nexora_backend.enums.FraudDecision;
import com.nexora_backend.enums.TransactionStatus;
import com.nexora_backend.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
public class Transaction extends BaseEntity {

    @Column(name = "transaction_reference", nullable = false, unique = true, length = 64)
    private String transactionReference;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;                        // source wallet

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_wallet_id")
    private Wallet destinationWallet;             // null unless TRANSFER

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private TransactionType type;

    @Column(name = "amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency", nullable = false, length = 3)
    private Currency currency = Currency.NPR;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TransactionStatus status = TransactionStatus.PENDING;

    @Column(name = "old_balance_orig", precision = 19, scale = 4)
    private BigDecimal oldBalanceOrig;

    @Column(name = "new_balance_orig", precision = 19, scale = 4)
    private BigDecimal newBalanceOrig;

    @Column(name = "old_balance_dest", precision = 19, scale = 4)
    private BigDecimal oldBalanceDest;

    @Column(name = "new_balance_dest", precision = 19, scale = 4)
    private BigDecimal newBalanceDest;

    @Enumerated(EnumType.STRING)
    @Column(name = "fraud_decision", length = 20)
    private FraudDecision fraudDecision;          // set by the fraud gate (Step 7)

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "device_id")
    private UUID deviceId;                         // becomes a @ManyToOne Device later

    @Column(name = "step")
    private Integer step;                          // hour-of-day; an ML feature

    @Column(name = "completed_at")
    private Instant completedAt;
}