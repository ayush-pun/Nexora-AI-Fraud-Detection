package com.nexora_backend.controller.admin;

import com.nexora_backend.dto.response.TransactionResponse;
import com.nexora_backend.service.transaction.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/transactions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTransactionController {

    private final TransactionService transactionService;

    @PostMapping("/{id}/reverse")
    public ResponseEntity<TransactionResponse> reverse(@PathVariable UUID id,
                                                       @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(transactionService.reverse(id, reason));
    }
}