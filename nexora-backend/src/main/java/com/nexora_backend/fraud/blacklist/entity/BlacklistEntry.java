package com.nexora_backend.fraud.blacklist.entity;

import com.nexora_backend.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "blacklist")
@Getter @Setter @NoArgsConstructor
public class BlacklistEntry extends BaseEntity {

    @Column(name = "entity_type", nullable = false, length = 20)
    private String entityType;                    // USER / WALLET / DEVICE / IP_ADDRESS / ACCOUNT

    @Column(name = "entity_value", nullable = false, length = 255)
    private String entityValue;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "severity", nullable = false, length = 20)
    private String severity = "MEDIUM";

    @Column(name = "added_by")
    private UUID addedBy;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "expires_at")
    private Instant expiresAt;
}