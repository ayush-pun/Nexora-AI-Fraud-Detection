package com.nexora_backend.fraud.casework.service;

import com.nexora_backend.entity.Transaction;
import com.nexora_backend.enums.CaseStatus;
import com.nexora_backend.enums.NotificationType;
import com.nexora_backend.enums.TransactionStatus;
import com.nexora_backend.fraud.casework.entity.FraudCase;
import com.nexora_backend.fraud.casework.repository.FraudCaseRepository;
import com.nexora_backend.notification.service.NotificationService;
import com.nexora_backend.repository.TransactionRepository;
import com.nexora_backend.service.transaction.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CaseWorkflowService {

    private final FraudCaseRepository caseRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;
    private final NotificationService notificationService;

    @Transactional
    public FraudCase resolve(UUID caseId, String resolution, String notes, UUID adminId, boolean reverseTransaction) {
        FraudCase c = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));
        if (c.getStatus() == CaseStatus.RESOLVED_FRAUD || c.getStatus() == CaseStatus.RESOLVED_LEGIT)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Case already resolved");

        c.setAssignedTo(adminId);
        c.setResolution(resolution);
        c.setResolutionNotes(notes);
        c.setResolvedAt(Instant.now());

        UUID txId = c.getTransaction().getId();

        if ("CONFIRMED_FRAUD".equals(resolution)) {
            c.setStatus(CaseStatus.RESOLVED_FRAUD);
            if (reverseTransaction) {
                transactionService.reverse(txId, "Confirmed fraud - funds reversed by fraud team");
            }
        } else {                                   // FALSE_POSITIVE / INCONCLUSIVE
            c.setStatus(CaseStatus.RESOLVED_LEGIT);
            Transaction tx = transactionRepository.findById(txId).orElseThrow();
            if (tx.getStatus() == TransactionStatus.UNDER_REVIEW) {  // release the hold flag
                tx.setStatus(TransactionStatus.COMPLETED);
                tx.setCompletedAt(Instant.now());
                transactionRepository.save(tx);
            }
            notificationService.notify(
                    tx.getWallet().getUser().getId(),
                    NotificationType.TRANSACTION,
                    "Transaction approved",
                    "Your " + tx.getType() + " of " + tx.getAmount() + " has been reviewed and approved.",
                    tx.getId());
        }
        return caseRepository.save(c);
    }
}