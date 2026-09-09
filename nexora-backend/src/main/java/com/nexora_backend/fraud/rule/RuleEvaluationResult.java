package com.nexora_backend.fraud.rule;

import java.math.BigDecimal;
import java.util.List;

// engine output: the normalized score in [0,1] + which rules fired (for rule_execution_logs)
public record RuleEvaluationResult(BigDecimal ruleRiskScore, List<RuleHit> hits) {}