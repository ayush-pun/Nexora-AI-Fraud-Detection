package com.nexora_backend.fraud.prediction.repository;

import com.nexora_backend.dashboard.projection.CountByKey;
import com.nexora_backend.fraud.prediction.entity.FraudPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FraudPredictionRepository extends JpaRepository<FraudPrediction, UUID> {
    Optional<FraudPrediction> findByTransaction_Id(UUID transactionId);

    @Query(value = """
        select case
                 when hybrid_risk_score < 0.20 then '0.0-0.2'
                 when hybrid_risk_score < 0.40 then '0.2-0.4'
                 when hybrid_risk_score < 0.60 then '0.4-0.6'
                 when hybrid_risk_score < 0.75 then '0.6-0.75'
                 else '0.75-1.0'
               end as label, count(*) as count
        from fraud_predictions
        group by label
        order by label
        """, nativeQuery = true)
    List<CountByKey> riskDistribution();
}