package com.nexora_backend.common.audit;

import com.nexora_backend.entity.User;
import com.nexora_backend.repository.UserRepository;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    @PersistenceContext
    private EntityManager em;
    private final UserRepository userRepository;

        // only audit admin write handlers, not read-only endpoints
        @Pointcut("within(com.nexora_backend.controller.admin..*) && (" +
            "@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PatchMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping))")
        void adminWriteControllers() {}

        @AfterReturning("adminWriteControllers()")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void audit(JoinPoint jp) {
        UUID userId = currentUserId();
        String action = jp.getSignature().getDeclaringType().getSimpleName()
                + "." + jp.getSignature().getName();
        // native insert avoids needing an AuditLog entity/repository just for this
        em.createNativeQuery("""
                insert into audit_logs (id, user_id, action, entity_type, created_at)
                values (gen_random_uuid_or_v4(), ?1, ?2, ?3, now())
                """.replace("gen_random_uuid_or_v4()", "uuid_generate_v4()"))
                .setParameter(1, userId)
                .setParameter(2, action)
                .setParameter(3, jp.getSignature().getDeclaringType().getSimpleName())
                .executeUpdate();
    }

    private UUID currentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails ud)) return null;
        return userRepository.findByEmail(ud.getUsername()).map(User::getId).orElse(null);
    }
}