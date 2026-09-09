package com.nexora_backend.fraud.rule;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface FraudRuleRepository extends JpaRepository<FraudRule, UUID> {
    List<FraudRule> findByEnabledTrueOrderByPriorityAsc();
}