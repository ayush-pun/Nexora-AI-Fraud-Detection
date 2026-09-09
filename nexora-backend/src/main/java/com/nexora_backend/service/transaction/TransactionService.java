package com.nexora_backend.service.transaction;

import com.nexora_backend.dto.request.AmountRequest;
import com.nexora_backend.dto.request.TransferRequest;
import com.nexora_backend.dto.response.TransactionResponse;
import java.util.List;
import java.util.UUID;

public interface TransactionService {
    TransactionResponse deposit(String email, AmountRequest request);
    TransactionResponse withdraw(String email, AmountRequest request);
    TransactionResponse transfer(String email, TransferRequest request);
    List<TransactionResponse> getHistory(String email);
    TransactionResponse reverse(UUID transactionId, String reason);
}