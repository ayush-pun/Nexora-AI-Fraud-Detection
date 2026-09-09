package com.nexora_backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
public class UserResponse {

    private UUID id;

    private String firstName;

    private String lastName;

    private String username;

    private String email;

    private String status;

    Set<String> roles;
}
