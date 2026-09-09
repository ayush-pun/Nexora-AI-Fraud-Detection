package com.nexora_backend.fraud.prediction.entity;

import com.nexora_backend.entity.Transaction;
import com.nexora_backend.enums.FraudDecision;
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
@Table(name = "fraud_predictions")
@Getter @Setter @NoArgsConstructor
public class FraudPrediction {   // NOT BaseEntity — no updated_at column

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id", nullable = false, unique = true)
    private Transaction transaction;

    @Column(name = "ml_risk_score", nullable = false, precision = 6, scale = 5)
    private BigDecimal mlRiskScore;

    @Column(name = "rule_risk_score", nullable = false, precision = 6, scale = 5)
    private BigDecimal ruleRiskScore;

    @Column(name = "hybrid_risk_score", nullable = false, precision = 6, scale = 5)
    private BigDecimal hybridRiskScore;

    @Column(name = "lightgbm_score", precision = 6, scale = 5)
    private BigDecimal lightgbmScore;

    @Column(name = "xgboost_score", precision = 6, scale = 5)
    private BigDecimal xgboostScore;

    @Column(name = "isolation_forest_score", precision = 6, scale = 5)
    private BigDecimal isolationForestScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "decision", nullable = false, length = 20)
    private FraudDecision decision;

    @Column(name = "confidence", precision = 6, scale = 5)
    private BigDecimal confidence;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "feature_vector")
    private Map<String, Object> featureVector;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "shap_values")
    private Map<String, Object> shapValues;

    @Column(name = "prediction_latency_ms")
    private Integer predictionLatencyMs;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;
}