package com.nexora_backend.fraud.service;

import com.nexora_backend.entity.Transaction;
import com.nexora_backend.enums.FraudDecision;
import com.nexora_backend.fraud.prediction.entity.FraudPrediction;
import com.nexora_backend.fraud.prediction.MlPredictionClient;
import com.nexora_backend.fraud.prediction.dto.request.PredictionRequest;
import com.nexora_backend.fraud.prediction.dto.response.PredictionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
public class FraudScoringService {

    private final MlPredictionClient mlClient;
    private final BigDecimal reviewThreshold;
    private final BigDecimal blockThreshold;

    public FraudScoringService(MlPredictionClient mlClient,
                               @Value("${nexora.fraud.review-threshold:0.40}") BigDecimal reviewThreshold,
                               @Value("${nexora.fraud.block-threshold:0.75}") BigDecimal blockThreshold) {
        this.mlClient = mlClient;
        this.reviewThreshold = reviewThreshold;
        this.blockThreshold = blockThreshold;
    }

    /** Score a transaction; never throws — always returns a usable prediction. */
    public FraudPrediction score(Transaction tx, BigDecimal ruleRiskScore) {
        PredictionRequest request = buildRequest(tx, ruleRiskScore);
        return mlClient.predict(request)
                .map(resp -> fromMlResponse(tx, resp))
                .orElseGet(() -> degraded(tx, ruleRiskScore));
    }

    private PredictionRequest buildRequest(Transaction tx, BigDecimal ruleRiskScore) {
        return new PredictionRequest(
                tx.getType().name(),
                tx.getAmount(),
                tx.getOldBalanceOrig(),
                tx.getNewBalanceOrig(),
                tx.getOldBalanceDest(),
                tx.getNewBalanceDest(),
                tx.getStep(),
                ruleRiskScore,
                true,
                tx.getTransactionReference());
    }

    private FraudPrediction fromMlResponse(Transaction tx, PredictionResponse r) {
        FraudPrediction p = new FraudPrediction();
        p.setTransaction(tx);
        p.setMlRiskScore(r.mlRiskScore());
        p.setRuleRiskScore(r.ruleRiskScore());
        p.setHybridRiskScore(r.hybridRiskScore());
        p.setLightgbmScore(r.lightgbmScore());
        p.setXgboostScore(r.xgboostScore());
        p.setIsolationForestScore(r.isolationForestScore());
        p.setDecision(FraudDecision.valueOf(r.decision()));
        p.setConfidence(r.confidence());
        p.setModelVersion(r.modelVersion());
        p.setShapValues(r.shapValues());
        p.setPredictionLatencyMs(r.predictionLatencyMs());
        return p;
    }

    /** ML unavailable: decide from the rule score alone. */
    private FraudPrediction degraded(Transaction tx, BigDecimal ruleRiskScore) {
        FraudPrediction p = new FraudPrediction();
        p.setTransaction(tx);
        p.setMlRiskScore(BigDecimal.ZERO);
        p.setRuleRiskScore(ruleRiskScore);
        p.setHybridRiskScore(ruleRiskScore);          // no ML component to blend
        p.setDecision(decide(ruleRiskScore));
        p.setModelVersion("rules-only");
        return p;
    }

    private FraudDecision decide(BigDecimal score) {
        if (score.compareTo(blockThreshold) >= 0) return FraudDecision.BLOCK;
        if (score.compareTo(reviewThreshold) >= 0) return FraudDecision.REVIEW;
        return FraudDecision.APPROVE;
    }
}