package com.nexora_backend.controller;

import com.nexora_backend.dto.request.AmountRequest;
import com.nexora_backend.dto.request.TransferRequest;
import com.nexora_backend.dto.response.TransactionResponse;
import com.nexora_backend.service.transaction.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@AuthenticationPrincipal UserDetails principal,
                                                       @Valid @RequestBody AmountRequest request) {
        return ResponseEntity.ok(transactionService.deposit(principal.getUsername(), request));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@AuthenticationPrincipal UserDetails principal,
                                                        @Valid @RequestBody AmountRequest request) {
        return ResponseEntity.ok(transactionService.withdraw(principal.getUsername(), request));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@AuthenticationPrincipal UserDetails principal,
                                                        @Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(transactionService.transfer(principal.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> history(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(transactionService.getHistory(principal.getUsername()));
    }
}