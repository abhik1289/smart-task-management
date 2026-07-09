package com.example.taskmanagement.taskmanagement.dto.response;


import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class ActiveAccountResponse {
    private String userEmail;
    private String message;
}
