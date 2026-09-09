package com.nexora_backend.repository;

import com.nexora_backend.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WalletRepository extends JpaRepository<Wallet, UUID> {
    Optional<Wallet> findByUser_Id(UUID userId);
    Optional<Wallet> findByWalletNumber(String walletNumber);
}
