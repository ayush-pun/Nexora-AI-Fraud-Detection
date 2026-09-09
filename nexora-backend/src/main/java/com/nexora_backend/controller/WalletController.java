package com.nexora_backend.controller;

import com.nexora_backend.dto.response.WalletResponse;
import com.nexora_backend.service.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletResponse> myWallet(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(walletService.getMyWallet(principal.getUsername()));
    }
}