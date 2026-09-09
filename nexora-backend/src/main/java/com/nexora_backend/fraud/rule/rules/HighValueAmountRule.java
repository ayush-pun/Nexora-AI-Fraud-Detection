package com.nexora_backend.fraud.rule.rules;

import com.nexora_backend.fraud.rule.*;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class HighValueAmountRule implements FraudRuleEvaluator {
    public String ruleCode() { return "AMT_HIGH_VALUE"; }
    public RuleOutcome evaluate(RuleContext ctx, FraudRule cfg) {
        var threshold = cfg.getThresholdValue();
        return (threshold != null && ctx.amount().compareTo(threshold) >= 0)
                ? RuleOutcome.triggered(Map.of("amount", ctx.amount(), "threshold", threshold))
                : RuleOutcome.notTriggered();
    }
}