package com.nexora_backend.fraud.casework.service;

import com.nexora_backend.entity.Transaction;
import com.nexora_backend.enums.CasePriority;
import com.nexora_backend.enums.FraudDecision;
import com.nexora_backend.fraud.casework.entity.FraudCase;
import com.nexora_backend.fraud.casework.repository.FraudCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class FraudCaseService {

    private final FraudCaseRepository repository;

    @Transactional
    public void openCase(Transaction tx, FraudDecision decision, BigDecimal hybridScore) {
        FraudCase c = new FraudCase();
        c.setTransaction(tx);
        c.setRiskScore(hybridScore);
        c.setPriority(priorityFor(decision, hybridScore));
        repository.save(c);
    }

    private CasePriority priorityFor(FraudDecision decision, BigDecimal score) {
        if (decision == FraudDecision.BLOCK) return CasePriority.CRITICAL;
        if (score != null && score.compareTo(new BigDecimal("0.60")) >= 0) return CasePriority.HIGH;
        return CasePriority.MEDIUM;
    }
}