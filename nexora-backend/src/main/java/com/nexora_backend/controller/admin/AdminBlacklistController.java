package com.nexora_backend.controller.admin;

import com.nexora_backend.dto.request.BlacklistRequest;
import com.nexora_backend.entity.User;
import com.nexora_backend.fraud.blacklist.entity.BlacklistEntry;
import com.nexora_backend.fraud.blacklist.repository.BlacklistRepository;
import com.nexora_backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/blacklist")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
public class AdminBlacklistController {

    private final BlacklistRepository blacklistRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<BlacklistEntry> active() {
        return blacklistRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<BlacklistEntry> add(@AuthenticationPrincipal UserDetails principal,
                                              @Valid @RequestBody BlacklistRequest req) {
        BlacklistEntry e = new BlacklistEntry();
        e.setEntityType(req.getEntityType());
        e.setEntityValue(req.getEntityValue());
        e.setReason(req.getReason());
        if (req.getSeverity() != null) e.setSeverity(req.getSeverity());
        e.setAddedBy(adminId(principal));
        return ResponseEntity.status(HttpStatus.CREATED).body(blacklistRepository.save(e));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deactivate(@PathVariable UUID id) {
        BlacklistEntry e = blacklistRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));
        e.setActive(false);                       // soft-delete: keeps history, frees the partial unique index
        return ResponseEntity.noContent().build();
    }

    private UUID adminId(UserDetails principal) {
        User u = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return u.getId();
    }
}