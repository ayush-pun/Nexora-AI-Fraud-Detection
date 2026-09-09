package com.nexora_backend.fraud.rule;

import java.util.Map;

public record RuleOutcome(boolean triggered, Map<String, Object> details) {
    private static final RuleOutcome NOT = new RuleOutcome(false, Map.of());
    public static RuleOutcome notTriggered() { return NOT; }
    public static RuleOutcome triggered(Map<String, Object> details) { return new RuleOutcome(true, details); }
}