package com.nexora_backend.fraud.rule.rules;

import com.nexora_backend.fraud.blacklist.repository.BlacklistRepository;
import com.nexora_backend.fraud.rule.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class BlacklistRule implements FraudRuleEvaluator {

    private final BlacklistRepository blacklistRepository;

    public String ruleCode() { return "BLK_MATCH"; }

    public RuleOutcome evaluate(RuleContext ctx, FraudRule cfg) {
        boolean userHit = blacklistRepository
                .findByEntityTypeAndEntityValueAndActiveTrue("USER", ctx.userId().toString()).isPresent();
        boolean ipHit = ctx.ipAddress() != null && blacklistRepository
                .findByEntityTypeAndEntityValueAndActiveTrue("IP_ADDRESS", ctx.ipAddress()).isPresent();
        return (userHit || ipHit)
                ? RuleOutcome.triggered(Map.of("blacklisted", userHit ? "USER" : "IP_ADDRESS"))
                : RuleOutcome.notTriggered();
    }
}