package com.nexora_backend.utils;

import com.nexora_backend.dto.response.UserResponse;
import com.nexora_backend.entity.Role;
import com.nexora_backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "status", expression = "java(user.getStatus().name())")
    UserResponse toResponse(User user);

    // MapStruct uses this to convert Set<Role> -> Set<String> for the `roles` field
    default Set<String> map(Set<Role> roles) {
        return roles == null ? Set.of()
                : roles.stream().map(Role::getName).collect(Collectors.toSet());
    }
}