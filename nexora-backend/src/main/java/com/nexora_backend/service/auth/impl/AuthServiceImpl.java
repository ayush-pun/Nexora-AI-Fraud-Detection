package com.nexora_backend.service.auth.impl;

import com.nexora_backend.dto.request.LoginRequest;
import com.nexora_backend.dto.request.RefreshTokenRequest;
import com.nexora_backend.dto.request.RegisterRequest;
import com.nexora_backend.dto.response.LoginResponse;
import com.nexora_backend.entity.Role;
import com.nexora_backend.entity.User;
import com.nexora_backend.entity.Wallet;
import com.nexora_backend.enums.Currency;
import com.nexora_backend.enums.UserStatus;
import com.nexora_backend.enums.WalletStatus;
import com.nexora_backend.repository.RoleRepository;
import com.nexora_backend.repository.UserRepository;
import com.nexora_backend.repository.WalletRepository;
import com.nexora_backend.service.auth.AuthService;
import com.nexora_backend.service.auth.CustomUserDetailsService;
import com.nexora_backend.service.auth.JwtService;
import com.nexora_backend.utils.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String DEFAULT_ROLE = "ROLE_USER";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        Role userRole = roleRepository.findByName(DEFAULT_ROLE)
                .orElseThrow(() -> new IllegalStateException(
                        "Default role " + DEFAULT_ROLE + " not found — check the Liquibase seed data"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setStatus(UserStatus.ACTIVE);
        user.getRoles().add(userRole);

        User saved = userRepository.save(user);

        Wallet wallet = new Wallet();
        wallet.setUser(saved);
        wallet.setWalletNumber(generateUniqueWalletNumber());
        wallet.setCurrency(Currency.NPR);
        wallet.setStatus(WalletStatus.ACTIVE);
        wallet.setBalance(BigDecimal.ZERO);
        walletRepository.save(wallet);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is " + user.getStatus());
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        return buildLoginResponse(user, userDetails, jwtService.generateRefreshToken(userDetails));
    }

    @Override
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String email = jwtService.extractUsername(refreshToken);
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired or invalid");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User no longer exists"));

        // issue a fresh access token; keep the current (still-valid) refresh token
        return buildLoginResponse(user, userDetails, refreshToken);
    }

    private LoginResponse buildLoginResponse(User user, UserDetails userDetails, String refreshToken) {
        String accessToken = jwtService.generateToken(userDetails);   // was generateAccessToken
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toResponse(user))
                .build();
    }

    private String generateUniqueWalletNumber() {
        for (int attempt = 0; attempt < 5; attempt++) {
            String candidate = "NX" + String.format("%014d",
                    Math.floorMod(RANDOM.nextLong(), 100_000_000_000_000L));
            if (walletRepository.findByWalletNumber(candidate).isEmpty()) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not generate a unique wallet number");
    }
}