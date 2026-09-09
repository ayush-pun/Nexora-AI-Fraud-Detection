package com.nexora_backend.controller.admin;

import com.nexora_backend.entity.User;
import com.nexora_backend.enums.UserStatus;
import com.nexora_backend.repository.UserRepository;
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
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<User> list() {
        return userRepository.findAll();
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public ResponseEntity<?> setStatus(@PathVariable UUID id, @RequestParam UserStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setStatus(status);                   // SUSPENDED / LOCKED / ACTIVE ...
        return ResponseEntity.ok(Map.of("id", id, "status", status));
    }
}