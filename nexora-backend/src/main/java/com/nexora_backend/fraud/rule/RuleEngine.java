package com.nexora_backend.fraud.rule;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RuleEngine {

    private static final BigDecimal MAX_POINTS = BigDecimal.valueOf(100);

    private final FraudRuleRepository ruleRepository;
    private final Map<String, FraudRuleEvaluator> evaluatorsByCode;

    // Spring injects ALL FraudRuleEvaluator beans; we index them by rule code
    public RuleEngine(FraudRuleRepository ruleRepository, List<FraudRuleEvaluator> evaluators) {
        this.ruleRepository = ruleRepository;
        this.evaluatorsByCode = evaluators.stream()
                .collect(Collectors.toMap(FraudRuleEvaluator::ruleCode, Function.identity()));
        log.info("RuleEngine loaded {} evaluators: {}", evaluatorsByCode.size(), evaluatorsByCode.keySet());
    }

    @Transactional(readOnly = true)
    public RuleEvaluationResult evaluate(RuleContext ctx) {
        List<RuleHit> hits = new ArrayList<>();
        BigDecimal totalPoints = BigDecimal.ZERO;

        for (FraudRule rule : ruleRepository.findByEnabledTrueOrderByPriorityAsc()) {
            FraudRuleEvaluator evaluator = evaluatorsByCode.get(rule.getRuleCode());
            if (evaluator == null) continue;                     // configured in DB, no code yet

            long start = System.nanoTime();
            RuleOutcome outcome;
            try {
                outcome = evaluator.evaluate(ctx, rule);
            } catch (Exception ex) {
                log.warn("Rule {} threw; treating as not-triggered", rule.getRuleCode(), ex);
                outcome = RuleOutcome.notTriggered();            // a broken rule never blocks scoring
            }
            long ms = (System.nanoTime() - start) / 1_000_000;

            if (outcome.triggered()) {
                totalPoints = totalPoints.add(rule.getRiskScore());
                hits.add(new RuleHit(rule.getId(), rule.getRuleCode(),
                        rule.getRiskScore(), outcome.details(), ms));
            }
        }

        BigDecimal score = totalPoints.min(MAX_POINTS).divide(MAX_POINTS, 5, RoundingMode.HALF_UP);
        return new RuleEvaluationResult(score, hits);
    }
}