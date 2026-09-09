package com.nexora_backend.service.wallet;

import com.nexora_backend.dto.response.WalletResponse;

public interface WalletService {
    WalletResponse getMyWallet(String email);
}