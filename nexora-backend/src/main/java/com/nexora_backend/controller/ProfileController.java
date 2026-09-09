package com.nexora_backend.controller;

import com.nexora_backend.dto.request.UpdateProfileRequest;
import com.nexora_backend.dto.response.UserResponse;
import com.nexora_backend.entity.User;
import com.nexora_backend.repository.UserRepository;
import com.nexora_backend.utils.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userMapper.toResponse(current(principal)));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<UserResponse> update(@AuthenticationPrincipal UserDetails principal,
                                               @org.springframework.web.bind.annotation.RequestBody
                                               @jakarta.validation.Valid UpdateProfileRequest req) {
        User user = current(principal);
        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName() != null) user.setLastName(req.getLastName());
        if (req.getPhoneNumber() != null) user.setPhoneNumber(req.getPhoneNumber());
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    private User current(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}