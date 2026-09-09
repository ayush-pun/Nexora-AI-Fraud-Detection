package com.nexora_backend.fraud.prediction.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)   // tolerate new fields Python may add
public record PredictionResponse(
        String decision,
        BigDecimal confidence,
        @JsonProperty("hybrid_risk_score") BigDecimal hybridRiskScore,
        @JsonProperty("ml_risk_score") BigDecimal mlRiskScore,
        @JsonProperty("rule_risk_score") BigDecimal ruleRiskScore,
        @JsonProperty("lightgbm_score") BigDecimal lightgbmScore,
        @JsonProperty("xgboost_score") BigDecimal xgboostScore,
        @JsonProperty("isolation_forest_score") BigDecimal isolationForestScore,
        @JsonProperty("model_version") String modelVersion,
        @JsonProperty("prediction_latency_ms") Integer predictionLatencyMs,
        @JsonProperty("shap_values") Map<String, Object> shapValues,
        @JsonProperty("transaction_reference") String transactionReference
) {}