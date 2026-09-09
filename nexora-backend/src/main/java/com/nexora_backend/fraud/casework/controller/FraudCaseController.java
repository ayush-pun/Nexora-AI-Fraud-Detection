package com.nexora_backend.fraud.casework.controller;

import com.nexora_backend.enums.CaseStatus;
import com.nexora_backend.fraud.casework.entity.FraudCase;
import com.nexora_backend.fraud.casework.repository.FraudCaseRepository;
import com.nexora_backend.fraud.casework.service.CaseWorkflowService;
import com.nexora_backend.repository.TransactionRepository;
import com.nexora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fraud-cases")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
public class FraudCaseController {

    private final FraudCaseRepository repository;
    private final CaseWorkflowService caseWorkflowService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<FraudCase>> list(@RequestParam(required = false) CaseStatus status) {
        return ResponseEntity.ok(status == null
                ? repository.findAllByOrderByCreatedAtDesc()
                : repository.findByStatusOrderByCreatedAtDesc(status));
    }

    @PatchMapping("/{id}/resolve")
    public FraudCase resolve(@org.springframework.security.core.annotation.AuthenticationPrincipal
                             org.springframework.security.core.userdetails.UserDetails principal,
                             @PathVariable java.util.UUID id,
                             @jakarta.validation.Valid @RequestBody
                             com.nexora_backend.dto.request.CaseResolutionRequest req) {
        java.util.UUID adminId = userRepository.findByEmail(principal.getUsername())
                .map(com.nexora_backend.entity.User::getId).orElse(null);
        return caseWorkflowService.resolve(id, req.getResolution(), req.getNotes(), adminId, req.isReverseTransaction());
    }
}