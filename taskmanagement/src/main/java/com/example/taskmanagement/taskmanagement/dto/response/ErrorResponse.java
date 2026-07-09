package com.example.taskmanagement.taskmanagement.dto.response;

import lombok.*;

import java.time.Instant;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private boolean success;

    private String message;

    private int status;

    private String path;

    private Instant timestamp;
}
