package com.nexora_backend.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateProfileRequest {
    @Size(max = 100) private String firstName;
    @Size(max = 100) private String lastName;
    @Pattern(regexp = "^$|^\\+?[0-9]{7,20}$", message = "Invalid phone number")
    private String phoneNumber;
}