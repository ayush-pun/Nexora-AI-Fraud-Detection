package com.nexora_backend.fraud.rule;

// the contract every developer-written rule implements
public interface FraudRuleEvaluator {
    String ruleCode();                                     // binds to fraud_rules.rule_code
    RuleOutcome evaluate(RuleContext ctx, FraudRule config);
}