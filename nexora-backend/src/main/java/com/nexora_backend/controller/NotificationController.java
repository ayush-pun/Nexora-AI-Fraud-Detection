package com.nexora_backend.controller;

import com.nexora_backend.entity.User;
import com.nexora_backend.notification.entity.Notification;
import com.nexora_backend.notification.repository.NotificationRepository;
import com.nexora_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> myNotifications(@AuthenticationPrincipal UserDetails principal) {
        UUID userId = currentUserId(principal);
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(@AuthenticationPrincipal UserDetails principal) {
        UUID userId = currentUserId(principal);
        return ResponseEntity.ok(Map.of("count",
                notificationRepository.countByUserIdAndReadFalse(userId)));
    }

    @PatchMapping("/{id}/read")
    @Transactional
    public ResponseEntity<Void> markRead(@AuthenticationPrincipal UserDetails principal,
                                         @PathVariable UUID id) {
        UUID userId = currentUserId(principal);
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));
        if (!n.getUserId().equals(userId)) {                 // ownership check
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your notification");
        }
        n.setRead(true);
        n.setReadAt(Instant.now());
        return ResponseEntity.noContent().build();
    }

    private UUID currentUserId(UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return user.getId();
    }
}