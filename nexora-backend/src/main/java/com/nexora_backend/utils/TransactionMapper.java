package com.nexora_backend.utils;

import com.nexora_backend.dto.response.TransactionResponse;
import com.nexora_backend.dto.response.WalletResponse;
import com.nexora_backend.entity.Transaction;
import com.nexora_backend.entity.Wallet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "type",     expression = "java(tx.getType().name())")
    @Mapping(target = "currency", expression = "java(tx.getCurrency().name())")
    @Mapping(target = "status",   expression = "java(tx.getStatus().name())")
    @Mapping(target = "fraudDecision",
            expression = "java(tx.getFraudDecision() == null ? null : tx.getFraudDecision().name())")
    TransactionResponse toResponse(Transaction tx);

    @Mapping(target = "currency", expression = "java(wallet.getCurrency().name())")
    @Mapping(target = "status",   expression = "java(wallet.getStatus().name())")
    WalletResponse toWalletResponse(Wallet wallet);
}