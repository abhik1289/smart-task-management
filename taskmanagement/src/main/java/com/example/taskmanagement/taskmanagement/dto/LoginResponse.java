package com.example.taskmanagement.taskmanagement.dto;


import lombok.Data;

@Data
public class LoginResponse {
    private String email;
    private String accessToken;
    private String refreshToken;
}
