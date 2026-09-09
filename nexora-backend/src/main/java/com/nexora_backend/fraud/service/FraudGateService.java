package com.nexora_backend.fraud.service;

import com.nexora_backend.entity.Transaction;
import com.nexora_backend.entity.User;
import com.nexora_backend.enums.FraudDecision;
import com.nexora_backend.fraud.GateResult;
import com.nexora_backend.fraud.prediction.entity.FraudPrediction;
import com.nexora_backend.fraud.prediction.repository.FraudPredictionRepository;
import com.nexora_backend.fraud.rule.*;
import com.nexora_backend.fraud.rule.repository.RuleExecutionLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FraudGateService {

    private final RuleEngine ruleEngine;
    private final FraudScoringService scoringService;
    private final FraudPredictionRepository predictionRepository;
    private final RuleExecutionLogRepository ruleLogRepository;

    /**
     * Runs the full gate on a persisted transaction (with balances already set to their
     * would-be values) and returns the decision. Persists fraud_predictions +
     * rule_execution_logs. Does NOT itself apply/revert balances — the caller does that
     * based on the returned decision.
     */
    public GateResult evaluate(Transaction tx, User user) {
        // 1. rules
        RuleContext ctx = RuleContext.from(tx, user);
        RuleEvaluationResult rules = ruleEngine.evaluate(ctx);

        // 2. ML (or graceful degradation) — returns a FraudPrediction bound to this tx
        FraudPrediction prediction = scoringService.score(tx, rules.ruleRiskScore());
        predictionRepository.save(prediction);

        // 3. per-rule audit trail
        List<RuleExecutionLog> logs = new ArrayList<>();
        for (RuleHit hit : rules.hits()) {
            RuleExecutionLog logRow = new RuleExecutionLog();
            logRow.setTransaction(tx);
            logRow.setRuleId(hit.ruleId());
            logRow.setTriggered(true);
            logRow.setRiskContribution(hit.riskContribution());
            logRow.setEvaluationDetails(hit.details());
            logRow.setExecutionTimeMs((int) hit.executionTimeMs());
            logs.add(logRow);
        }
        ruleLogRepository.saveAll(logs);

        FraudDecision decision = prediction.getDecision();
        tx.setFraudDecision(decision);
        log.info("Fraud gate: tx={} rules={} hybrid={} -> {}",
                tx.getTransactionReference(), rules.ruleRiskScore(),
                prediction.getHybridRiskScore(), decision);
        return new GateResult(decision, prediction.getHybridRiskScore());
    }
}