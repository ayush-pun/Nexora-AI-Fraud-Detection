package com.nexora_backend.service.auth;

import com.nexora_backend.dto.request.LoginRequest;
import com.nexora_backend.dto.request.RefreshTokenRequest;
import com.nexora_backend.dto.request.RegisterRequest;
import com.nexora_backend.dto.response.LoginResponse;

public interface AuthService {

    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse refreshToken(RefreshTokenRequest request);

}
