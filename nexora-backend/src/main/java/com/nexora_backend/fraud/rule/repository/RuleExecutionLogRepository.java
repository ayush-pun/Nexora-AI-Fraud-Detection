package com.nexora_backend.fraud.rule.repository;

import com.nexora_backend.fraud.rule.RuleExecutionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RuleExecutionLogRepository extends JpaRepository<RuleExecutionLog, UUID> {}