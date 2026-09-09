package com.nexora_backend.repository;

import com.nexora_backend.dashboard.projection.HighRiskUser;
import com.nexora_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    @Query(value = """
        select u.id as userId, u.username as username,
               count(fp.id) as flaggedCount,
               max(fp.hybrid_risk_score) as maxRisk
        from fraud_predictions fp
        join transactions t on t.id = fp.transaction_id
        join wallets w on w.id = t.wallet_id
        join users u on u.id = w.user_id
        where fp.decision in ('REVIEW','BLOCK')
        group by u.id, u.username
        order by flaggedCount desc, maxRisk desc
        limit :limit
        """, nativeQuery = true)
    List<HighRiskUser> highRiskUsers(@Param("limit") int limit);
}
