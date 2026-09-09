package com.nexora_backend.fraud.rule;

import com.nexora_backend.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "fraud_rules")
@Getter @Setter @NoArgsConstructor
public class FraudRule extends BaseEntity {

    @Column(name = "rule_code", nullable = false, unique = true, length = 50)
    private String ruleCode;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private RuleCategory category;

    @Column(name = "rule_class", nullable = false, length = 255)
    private String ruleClass;                     // documentation only; binding is by ruleCode

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "threshold_value", precision = 19, scale = 4)
    private BigDecimal thresholdValue;            // nullable (some rules don't use it)

    @Column(name = "risk_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal riskScore = BigDecimal.ZERO;   // 0..100 points

    @Column(name = "priority", nullable = false)
    private int priority = 100;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "config", nullable = false)
    private Map<String, Object> config = new HashMap<>();

    // safe readers for the JSONB config (JSON numbers deserialize as Number)
    public int configInt(String key, int def) {
        Object v = config == null ? null : config.get(key);
        return v instanceof Number n ? n.intValue() : def;
    }
    public long configLong(String key, long def) {
        Object v = config == null ? null : config.get(key);
        return v instanceof Number n ? n.longValue() : def;
    }
}