package com.example.taskmanagement.taskmanagement.dto;

import com.example.taskmanagement.taskmanagement.entity.enums.Priority;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Priority priority;

    @NotNull
    @Future
    private LocalDateTime dueDate;

    @NotNull
    private Long assigneeId;
}
