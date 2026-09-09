package com.nexora_backend.fraud.rule.rules;

import com.nexora_backend.fraud.rule.*;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class OddHourRule implements FraudRuleEvaluator {
    public String ruleCode() { return "TIME_ODD_HOUR"; }
    public RuleOutcome evaluate(RuleContext ctx, FraudRule cfg) {
        int start = cfg.configInt("startHour", 1);
        int end   = cfg.configInt("endHour", 5);
        int h = ctx.hour();
        boolean inWindow = (start <= end) ? (h >= start && h <= end) : (h >= start || h <= end);
        return inWindow
                ? RuleOutcome.triggered(Map.of("hour", h, "window", start + "-" + end))
                : RuleOutcome.notTriggered();
    }
}