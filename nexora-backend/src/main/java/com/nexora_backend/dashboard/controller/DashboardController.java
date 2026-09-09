package com.nexora_backend.dashboard.controller;

import com.nexora_backend.dashboard.MlMetricsClient;
import com.nexora_backend.dashboard.projection.*;
import com.nexora_backend.fraud.prediction.repository.FraudPredictionRepository;
import com.nexora_backend.repository.TransactionRepository;
import com.nexora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
public class DashboardController {

    private final TransactionRepository transactionRepository;
    private final FraudPredictionRepository predictionRepository;
    private final UserRepository userRepository;
    private final MlMetricsClient mlMetricsClient;

    @GetMapping("/overview")
    public OverviewStats overview() {
        return transactionRepository.fetchOverview();
    }

    @GetMapping("/decision-breakdown")
    public List<CountByKey> decisionBreakdown() {
        return transactionRepository.countByDecision();
    }

    @GetMapping("/fraud-by-hour")
    public List<HourlyFraud> fraudByHour() {
        return transactionRepository.fraudByHour();
    }

    @GetMapping("/fraud-by-amount")
    public List<CountByKey> fraudByAmount() {
        return transactionRepository.fraudByAmountBand();
    }

    @GetMapping("/risk-distribution")
    public List<CountByKey> riskDistribution() {
        return predictionRepository.riskDistribution();
    }

    @GetMapping("/high-risk-users")
    public List<HighRiskUser> highRiskUsers(@RequestParam(defaultValue = "10") int limit) {
        return userRepository.highRiskUsers(limit);
    }

    @GetMapping("/recent-transactions")
    public List<Object[]> recentTransactions(@RequestParam(defaultValue = "20") int limit) {
        return transactionRepository.recentTransactions(limit);
    }

    // ---- ML passthrough ----

    @GetMapping("/model-metrics")
    public ResponseEntity<?> modelMetrics() {
        return mlMetricsClient.get("/metrics")
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("error", "ML metrics unavailable")));
    }

    @GetMapping("/shap-global")
    public ResponseEntity<?> shapGlobal() {
        return mlMetricsClient.get("/shap")
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("error", "ML SHAP unavailable")));
    }
}