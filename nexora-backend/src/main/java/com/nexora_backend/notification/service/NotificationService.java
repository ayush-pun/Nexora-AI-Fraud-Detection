package com.nexora_backend.notification.service;

import com.nexora_backend.enums.NotificationChannel;
import com.nexora_backend.enums.NotificationType;
import com.nexora_backend.notification.entity.Notification;
import com.nexora_backend.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    @Transactional
    public void notify(UUID userId, NotificationType type, String title, String message, UUID referenceId) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setChannel(NotificationChannel.IN_APP);
        n.setReferenceId(referenceId);
        repository.save(n);
    }
}