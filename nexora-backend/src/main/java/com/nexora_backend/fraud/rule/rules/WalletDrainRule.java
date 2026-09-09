package com.nexora_backend.fraud.rule.rules;

import com.nexora_backend.enums.TransactionType;
import com.nexora_backend.fraud.rule.*;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Component
public class WalletDrainRule implements FraudRuleEvaluator {
    public String ruleCode() { return "WAL_DRAIN"; }
    public RuleOutcome evaluate(RuleContext ctx, FraudRule cfg) {
        if (ctx.type() == TransactionType.DEPOSIT) return RuleOutcome.notTriggered();  // outflows only
        BigDecimal old = ctx.oldBalanceOrig();
        if (old == null || old.signum() <= 0) return RuleOutcome.notTriggered();
        BigDecimal ratio = ctx.amount().divide(old, 4, RoundingMode.HALF_UP);
        BigDecimal threshold = cfg.getThresholdValue() != null ? cfg.getThresholdValue() : new BigDecimal("0.9");
        return ratio.compareTo(threshold) >= 0
                ? RuleOutcome.triggered(Map.of("drainRatio", ratio, "threshold", threshold))
                : RuleOutcome.notTriggered();
    }
}