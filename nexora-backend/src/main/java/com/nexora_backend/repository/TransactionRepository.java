package com.nexora_backend.repository;

import com.nexora_backend.dashboard.projection.CountByKey;
import com.nexora_backend.dashboard.projection.HourlyFraud;
import com.nexora_backend.dashboard.projection.OverviewStats;
import com.nexora_backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    boolean existsByTransactionReference(String reference);

    @Query("""
           select t from Transaction t
           where t.wallet.id = :walletId or t.destinationWallet.id = :walletId
           order by t.createdAt desc
           """)
    List<Transaction> findWalletHistory(@Param("walletId") UUID walletId);

    @Query("select count(t) from Transaction t where t.wallet.id = :walletId and t.createdAt >= :since")
    long countByWalletIdSince(@Param("walletId") UUID walletId, @Param("since") Instant since);

    // ---- dashboard aggregates ----

    @Query(value = """
        select
          (select count(*) from users)                                              as totalUsers,
          (select count(*) from transactions)                                        as totalTransactions,
          (select count(*) from transactions where fraud_decision in ('REVIEW','BLOCK')) as flaggedTransactions,
          (select count(*) from transactions where fraud_decision = 'BLOCK')         as blockedTransactions,
          (select count(*) from fraud_cases where status in ('OPEN','IN_REVIEW','ESCALATED')) as openCases,
          (select coalesce(sum(amount),0) from transactions where status = 'COMPLETED') as totalVolume
        """, nativeQuery = true)
    OverviewStats fetchOverview();

    @Query(value = """
        select coalesce(fraud_decision, status) as label, count(*) as count
        from transactions
        group by coalesce(fraud_decision, status)
        """, nativeQuery = true)
    List<CountByKey> countByDecision();

    @Query(value = """
        select step as hour,
               count(*) as total,
               count(*) filter (where fraud_decision in ('REVIEW','BLOCK')) as fraud
        from transactions
        where step is not null
        group by step
        order by step
        """, nativeQuery = true)
    List<HourlyFraud> fraudByHour();

    @Query(value = """
        select case
                 when amount < 1000    then '0-1k'
                 when amount < 10000   then '1k-10k'
                 when amount < 50000   then '10k-50k'
                 when amount < 200000  then '50k-200k'
                 else '200k+'
               end as label,
               count(*) filter (where fraud_decision in ('REVIEW','BLOCK')) as count
        from transactions
        group by label
        """, nativeQuery = true)
    List<CountByKey> fraudByAmountBand();

    @Query(value = """
        select t.id, t.transaction_reference, t.type, t.amount, t.status,
               t.fraud_decision, t.created_at
        from transactions t
        order by t.created_at desc
        limit :limit
        """, nativeQuery = true)
    List<Object[]> recentTransactions(@Param("limit") int limit);
}