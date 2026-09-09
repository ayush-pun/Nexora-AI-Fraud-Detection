package com.nexora_backend.service.transaction.impl;

import com.nexora_backend.dto.request.AmountRequest;
import com.nexora_backend.dto.request.TransferRequest;
import com.nexora_backend.dto.response.TransactionResponse;
import com.nexora_backend.entity.Transaction;
import com.nexora_backend.entity.User;
import com.nexora_backend.entity.Wallet;
import com.nexora_backend.enums.FraudDecision;
import com.nexora_backend.enums.NotificationType;
import com.nexora_backend.enums.TransactionStatus;
import com.nexora_backend.enums.TransactionType;
import com.nexora_backend.enums.WalletStatus;
import com.nexora_backend.fraud.service.FraudGateService;
import com.nexora_backend.fraud.GateResult;
import com.nexora_backend.fraud.casework.service.FraudCaseService;
import com.nexora_backend.notification.service.NotificationService;
import com.nexora_backend.repository.TransactionRepository;
import com.nexora_backend.repository.UserRepository;
import com.nexora_backend.repository.WalletRepository;
import com.nexora_backend.service.transaction.TransactionService;
import com.nexora_backend.utils.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionMapper mapper;
    private final FraudGateService fraudGateService;
    private final NotificationService notificationService;
    private final FraudCaseService fraudCaseService;

    // ---------------------------------------------------------------------
    // DEPOSIT — money coming in is not gated (fraud lives in outflows)
    // ---------------------------------------------------------------------
    @Override
    @Transactional
    public TransactionResponse deposit(String email, AmountRequest request) {
        User user = requireUser(email);
        Wallet wallet = activeWallet(user);

        BigDecimal oldBalance = wallet.getBalance();
        BigDecimal newBalance = oldBalance.add(request.getAmount());
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        Transaction tx = baseTransaction(wallet, TransactionType.DEPOSIT,
                request.getAmount(), request.getDescription());
        tx.setOldBalanceOrig(oldBalance);
        tx.setNewBalanceOrig(newBalance);
        tx.setFraudDecision(FraudDecision.APPROVE);
        tx.setStatus(TransactionStatus.COMPLETED);
        tx.setCompletedAt(Instant.now());
        tx = transactionRepository.save(tx);

        notificationService.notify(user.getId(), NotificationType.TRANSACTION,
                "Deposit completed",
                "Deposit of " + tx.getAmount() + " " + tx.getCurrency() + " completed.",
                tx.getId());

        return mapper.toResponse(tx);
    }

    // ---------------------------------------------------------------------
    // WITHDRAW — gated: score on would-be balances, block never moves money
    // ---------------------------------------------------------------------
    @Override
    @Transactional
    public TransactionResponse withdraw(String email, AmountRequest request) {
        User user = requireUser(email);
        Wallet wallet = activeWallet(user);

        BigDecimal oldBalance = wallet.getBalance();
        if (oldBalance.compareTo(request.getAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Insufficient balance");
        }
        BigDecimal newBalance = oldBalance.subtract(request.getAmount());

        Transaction tx = baseTransaction(wallet, TransactionType.WITHDRAWAL,
                request.getAmount(), request.getDescription());
        tx.setOldBalanceOrig(oldBalance);
        tx.setNewBalanceOrig(newBalance);
        tx = transactionRepository.save(tx);            // persist first -> id for FKs

        GateResult gate = fraudGateService.evaluate(tx, user);

        if (gate.decision() != FraudDecision.BLOCK) {
            wallet.setBalance(newBalance);              // APPROVE or REVIEW: money moves
            walletRepository.save(wallet);
            finish(tx, gate.decision());
        } else {
            reject(tx);                                 // BLOCK: no balance change
        }
        tx = transactionRepository.save(tx);

        afterGate(user, tx, gate);
        return mapper.toResponse(tx);
    }

    // ---------------------------------------------------------------------
    // TRANSFER — gated: both wallets settle only on APPROVE/REVIEW
    // ---------------------------------------------------------------------
    @Override
    @Transactional
    public TransactionResponse transfer(String email, TransferRequest request) {
        User user = requireUser(email);
        Wallet source = activeWallet(user);
        Wallet dest = walletRepository.findByWalletNumber(request.getDestinationWalletNumber())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Destination wallet not found"));

        if (source.getId().equals(dest.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot transfer to the same wallet");
        }
        if (dest.getStatus() != WalletStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Destination wallet is not active");
        }
        if (source.getCurrency() != dest.getCurrency()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Currency mismatch");
        }

        BigDecimal sourceOld = source.getBalance();
        if (sourceOld.compareTo(request.getAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Insufficient balance");
        }

        BigDecimal destOld = dest.getBalance();
        BigDecimal sourceNew = sourceOld.subtract(request.getAmount());
        BigDecimal destNew = destOld.add(request.getAmount());

        Transaction tx = baseTransaction(source, TransactionType.TRANSFER,
                request.getAmount(), request.getDescription());
        tx.setDestinationWallet(dest);
        tx.setOldBalanceOrig(sourceOld);
        tx.setNewBalanceOrig(sourceNew);
        tx.setOldBalanceDest(destOld);
        tx.setNewBalanceDest(destNew);
        tx = transactionRepository.save(tx);

        GateResult gate = fraudGateService.evaluate(tx, user);

        if (gate.decision() != FraudDecision.BLOCK) {
            source.setBalance(sourceNew);
            dest.setBalance(destNew);
            walletRepository.save(source);
            walletRepository.save(dest);
            finish(tx, gate.decision());
        } else {
            reject(tx);
        }
        tx = transactionRepository.save(tx);

        afterGate(user, tx, gate);
        return mapper.toResponse(tx);
    }

    // ---------------------------------------------------------------------
    // HISTORY
    // ---------------------------------------------------------------------
    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getHistory(String email) {
        User user = requireUser(email);
        Wallet wallet = walletRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));
        return transactionRepository.findWalletHistory(wallet.getId())
                .stream().map(mapper::toResponse).toList();
    }

    //for fraud transaction roll back by admin
    @Override
    @Transactional
    public TransactionResponse reverse(UUID transactionId, String reason) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

        if (tx.getStatus() == TransactionStatus.REVERSED)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already reversed");
        if (tx.getStatus() == TransactionStatus.BLOCKED)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Blocked transactions never moved money");

        Wallet source = tx.getWallet();
        switch (tx.getType()) {
            case WITHDRAWAL -> source.setBalance(source.getBalance().add(tx.getAmount()));
            case DEPOSIT    -> source.setBalance(source.getBalance().subtract(tx.getAmount()).max(BigDecimal.ZERO));
            case TRANSFER   -> {
                source.setBalance(source.getBalance().add(tx.getAmount()));
                Wallet dest = tx.getDestinationWallet();
                if (dest != null) {
                    dest.setBalance(dest.getBalance().subtract(tx.getAmount()).max(BigDecimal.ZERO));
                    walletRepository.save(dest);
                }
            }
            default -> { }
        }
        walletRepository.save(source);

        tx.setStatus(TransactionStatus.REVERSED);
        tx = transactionRepository.save(tx);

        notificationService.notify(source.getUser().getId(), NotificationType.SECURITY,
                "Transaction reversed",
                (reason != null ? reason : "A transaction was reversed by our fraud team") + ".",
                tx.getId());
        return mapper.toResponse(tx);
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------

    private Transaction baseTransaction(Wallet wallet, TransactionType type,
                                        BigDecimal amount, String description) {
        Transaction tx = new Transaction();
        tx.setTransactionReference(generateReference());
        tx.setWallet(wallet);
        tx.setType(type);
        tx.setAmount(amount);
        tx.setCurrency(wallet.getCurrency());
        tx.setStatus(TransactionStatus.PENDING);
        tx.setDescription(description);
        tx.setStep(LocalTime.now().getHour());          // hour-of-day feature for the ML model
        return tx;
    }

    /** APPROVE -> COMPLETED; REVIEW -> UNDER_REVIEW (money moved, flagged for an analyst). */
    private void finish(Transaction tx, FraudDecision decision) {
        if (decision == FraudDecision.REVIEW) {
            tx.setStatus(TransactionStatus.UNDER_REVIEW);
        } else {
            tx.setStatus(TransactionStatus.COMPLETED);
            tx.setCompletedAt(Instant.now());
        }
    }

    /** BLOCK -> BLOCKED, no balance change. */
    private void reject(Transaction tx) {
        tx.setStatus(TransactionStatus.BLOCKED);
    }

    /** Side effects after the gate: user notification + (REVIEW/BLOCK) analyst case. */
    private void afterGate(User user, Transaction tx, GateResult gate) {
        UUID userId = user.getId();
        UUID ref = tx.getId();

        switch (gate.decision()) {
            case APPROVE -> notificationService.notify(userId, NotificationType.TRANSACTION,
                    "Transaction completed",
                    tx.getType() + " of " + tx.getAmount() + " " + tx.getCurrency() + " completed.",
                    ref);

            case REVIEW -> {
                notificationService.notify(userId, NotificationType.FRAUD_ALERT,
                        "Transaction under review",
                        "Your " + tx.getType() + " of " + tx.getAmount()
                                + " is being reviewed for your security.",
                        ref);
                fraudCaseService.openCase(tx, gate.decision(), gate.hybridScore());
            }

            case BLOCK -> {
                notificationService.notify(userId, NotificationType.FRAUD_ALERT,
                        "Transaction blocked",
                        "Your " + tx.getType() + " of " + tx.getAmount()
                                + " was blocked as potentially fraudulent.",
                        ref);
                fraudCaseService.openCase(tx, gate.decision(), gate.hybridScore());
            }
        }
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Wallet activeWallet(User user) {
        Wallet wallet = walletRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));
        if (wallet.getStatus() != WalletStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Wallet is " + wallet.getStatus());
        }
        return wallet;
    }

    private String generateReference() {
        for (int i = 0; i < 5; i++) {
            String ref = "TXN-" + UUID.randomUUID().toString()
                    .replace("-", "").substring(0, 20).toUpperCase();
            if (!transactionRepository.existsByTransactionReference(ref)) return ref;
        }
        throw new IllegalStateException("Could not generate a unique transaction reference");
    }
}