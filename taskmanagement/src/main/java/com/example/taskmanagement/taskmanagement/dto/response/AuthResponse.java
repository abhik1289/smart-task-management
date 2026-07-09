package com.example.taskmanagement.taskmanagement.dto.response;


import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String access_token;
    private String refresh_token;
}
