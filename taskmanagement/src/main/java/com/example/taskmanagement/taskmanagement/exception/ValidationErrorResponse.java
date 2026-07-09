package com.example.taskmanagement.taskmanagement.exception;


import lombok.*;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ValidationErrorResponse {
    private boolean success;

    private String message;

    private Map<String, String> errors;

    private Instant timestamp;

}
