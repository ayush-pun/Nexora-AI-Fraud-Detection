package com.nexora_backend.fraud.rule.rules;

import com.nexora_backend.fraud.rule.*;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;

@Component
public class NewAccountRule implements FraudRuleEvaluator {
    public String ruleCode() { return "USR_NEW_ACCOUNT"; }
    public RuleOutcome evaluate(RuleContext ctx, FraudRule cfg) {
        if (ctx.userCreatedAt() == null) return RuleOutcome.notTriggered();
        long maxAgeDays = cfg.configLong("maxAccountAgeDays", 7);
        BigDecimal amountThreshold = cfg.getThresholdValue() != null ? cfg.getThresholdValue() : new BigDecimal("50000");
        long ageDays = Duration.between(ctx.userCreatedAt(), Instant.now()).toDays();
        return (ageDays <= maxAgeDays && ctx.amount().compareTo(amountThreshold) >= 0)
                ? RuleOutcome.triggered(Map.of("accountAgeDays", ageDays, "amount", ctx.amount()))
                : RuleOutcome.notTriggered();
    }
}