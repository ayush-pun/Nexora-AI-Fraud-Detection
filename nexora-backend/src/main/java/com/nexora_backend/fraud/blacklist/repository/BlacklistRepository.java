package com.nexora_backend.fraud.blacklist.repository;

import com.nexora_backend.fraud.blacklist.entity.BlacklistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BlacklistRepository extends JpaRepository<BlacklistEntry, UUID> {
    List<BlacklistEntry> findByActiveTrueOrderByCreatedAtDesc();
    Optional<BlacklistEntry> findByEntityTypeAndEntityValueAndActiveTrue(String entityType, String entityValue);
}