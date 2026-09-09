package com.nexora_backend.fraud.rule.rules;

import com.nexora_backend.fraud.rule.*;
import com.nexora_backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class TransactionVelocityRule implements FraudRuleEvaluator {
    private final TransactionRepository transactionRepository;
    public String ruleCode() { return "VEL_TXN_BURST"; }
    public RuleOutcome evaluate(RuleContext ctx, FraudRule cfg) {
        long windowSeconds = cfg.configLong("windowSeconds", 60);
        int threshold = cfg.getThresholdValue() != null ? cfg.getThresholdValue().intValue() : 5;
        Instant since = Instant.now().minusSeconds(windowSeconds);
        long recent = transactionRepository.countByWalletIdSince(ctx.walletId(), since);
        return recent >= threshold
                ? RuleOutcome.triggered(Map.of("recentCount", recent, "windowSeconds", windowSeconds, "threshold", threshold))
                : RuleOutcome.notTriggered();
    }
}