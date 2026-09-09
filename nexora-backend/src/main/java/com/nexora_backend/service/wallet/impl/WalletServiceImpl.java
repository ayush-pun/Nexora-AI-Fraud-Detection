package com.nexora_backend.service.wallet.impl;

import com.nexora_backend.dto.response.WalletResponse;
import com.nexora_backend.entity.User;
import com.nexora_backend.entity.Wallet;
import com.nexora_backend.repository.UserRepository;
import com.nexora_backend.repository.WalletRepository;
import com.nexora_backend.service.wallet.WalletService;
import com.nexora_backend.utils.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public WalletResponse getMyWallet(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Wallet wallet = walletRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wallet not found"));
        return mapper.toWalletResponse(wallet);
    }
}