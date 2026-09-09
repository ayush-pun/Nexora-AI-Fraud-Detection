package com.nexora_backend.fraud.casework.entity;

import com.nexora_backend.entity.BaseEntity;
import com.nexora_backend.entity.Transaction;
import com.nexora_backend.enums.CasePriority;
import com.nexora_backend.enums.CaseStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "fraud_cases")
@Getter @Setter @NoArgsConstructor
public class FraudCase extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id", nullable = false, unique = true)
    private Transaction transaction;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private CaseStatus status = CaseStatus.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private CasePriority priority = CasePriority.MEDIUM;

    @Column(name = "assigned_to")
    private UUID assignedTo;

    @Column(name = "risk_score", precision = 6, scale = 5)
    private BigDecimal riskScore;

    @Column(name = "resolution", length = 20)
    private String resolution;                    // CONFIRMED_FRAUD / FALSE_POSITIVE / INCONCLUSIVE

    @Column(name = "resolution_notes", length = 1000)
    private String resolutionNotes;

    @Column(name = "resolved_at")
    private Instant resolvedAt;
}