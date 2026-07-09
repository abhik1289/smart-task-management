package com.example.taskmanagement.taskmanagement.exception;


import lombok.*;

import java.time.Instant;
import java.util.Map;


public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
