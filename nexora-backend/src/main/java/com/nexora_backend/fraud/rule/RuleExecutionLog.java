package com.nexora_backend.fraud.rule;

import com.nexora_backend.entity.Transaction;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "rule_execution_logs")
@Getter @Setter @NoArgsConstructor
public class RuleExecutionLog {                       // NOT BaseEntity — no updated_at

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @Column(name = "rule_id", nullable = false)
    private UUID ruleId;

    @Column(name = "triggered", nullable = false)
    private boolean triggered;

    @Column(name = "risk_contribution", nullable = false, precision = 5, scale = 2)
    private BigDecimal riskContribution = BigDecimal.ZERO;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "evaluation_details")
    private Map<String, Object> evaluationDetails;

    @Column(name = "execution_time_ms")
    private Integer executionTimeMs;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;
}