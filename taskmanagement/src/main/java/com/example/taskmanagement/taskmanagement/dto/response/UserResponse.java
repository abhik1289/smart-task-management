package com.example.taskmanagement.taskmanagement.dto.response;


import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.entity.enums.Provider;
import com.example.taskmanagement.taskmanagement.entity.enums.Roles;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;

    private String name;

    private String email;
    private Roles role;
    private Provider provider;

    private boolean emailVerified;

    private LocalDateTime createdAt;

}
