package com.nexora_backend.controller.admin;

import com.nexora_backend.dto.response.AdminWalletResponse;
import com.nexora_backend.entity.Wallet;
import com.nexora_backend.enums.WalletStatus;
import com.nexora_backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/wallets")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminWalletController {

    private final WalletRepository walletRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public List<AdminWalletResponse> list() {
        return walletRepository.findAll().stream()
                .map(wallet -> AdminWalletResponse.builder()
                        .id(wallet.getId())
                        .walletNumber(wallet.getWalletNumber())
                        .userId(wallet.getUser().getId())
                        .username(wallet.getUser().getUsername())
                        .balance(wallet.getBalance())
                        .currency(wallet.getCurrency().name())
                        .status(wallet.getStatus().name())
                        .build())
                .toList();
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public ResponseEntity<?> setStatus(@PathVariable UUID id, @RequestParam WalletStatus status) {
        Wallet wallet = walletRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));
        wallet.setStatus(status);                 // FROZEN / CLOSED / ACTIVE
        return ResponseEntity.ok(Map.of("id", id, "status", status));
    }
}