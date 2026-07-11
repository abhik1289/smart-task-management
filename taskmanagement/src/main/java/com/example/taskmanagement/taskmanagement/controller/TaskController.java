package com.example.taskmanagement.taskmanagement.controller;

import com.example.taskmanagement.taskmanagement.dto.response.ApiResponse;
import com.example.taskmanagement.taskmanagement.entity.Task;
import com.example.taskmanagement.taskmanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@Slf4j
@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/workspace/{workspaceId}")
    @PreAuthorize("hasRole('USERS') and principal.emailVerified == true")
    public ResponseEntity<ApiResponse<Page<Task>>> getTasksByWorkspace(
            @PathVariable Long workspaceId,
            @RequestParam(defaultValue = "false") boolean completed,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Task> tasks = taskService.findAllTaskByWorkspaceIdAndCompleted(workspaceId, completed, page, size);

        ApiResponse<Page<Task>> apiResponse = ApiResponse.<Page<Task>>builder()
                .success(true)
                .message("Tasks loaded")
                .data(tasks)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/workspace/{workspaceId}/assigned/{userId}")
    @PreAuthorize("hasRole('USERS') and principal.emailVerified == true")
    public ResponseEntity<ApiResponse<Page<Task>>> getTasksForUserInWorkspace(
            @PathVariable Long workspaceId,
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Task> tasks = taskService.findAllTaskByUserIdAndWorkspaceId(userId, workspaceId, page, size);

        ApiResponse<Page<Task>> apiResponse = ApiResponse.<Page<Task>>builder()
                .success(true)
                .message("Assigned tasks loaded")
                .data(tasks)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
