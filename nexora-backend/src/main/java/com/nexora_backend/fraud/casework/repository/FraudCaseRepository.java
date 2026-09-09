package com.nexora_backend.fraud.casework.repository;

import com.nexora_backend.enums.CaseStatus;
import com.nexora_backend.fraud.casework.entity.FraudCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface FraudCaseRepository extends JpaRepository<FraudCase, UUID> {
    List<FraudCase> findByStatusOrderByCreatedAtDesc(CaseStatus status);
    List<FraudCase> findAllByOrderByCreatedAtDesc();
}