package com.example.taskmanagement.taskmanagement.controller;

import com.example.taskmanagement.taskmanagement.dto.response.ApiResponse;
import com.example.taskmanagement.taskmanagement.dto.response.NotificationResponse;
import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.security.CurrentUser;
import com.example.taskmanagement.taskmanagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @PreAuthorize("isAuthenticated() and principal.emailVerified == true")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> list(
            @CurrentUser User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<NotificationResponse> data = notificationService.listForUser(user.getId(), page, size);

        ApiResponse<Page<NotificationResponse>> body = ApiResponse.<Page<NotificationResponse>>builder()
                .success(true)
                .message("Notifications loaded")
                .data(data)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(body);
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated() and principal.emailVerified == true")
    public ResponseEntity<ApiResponse<Map<String, Long>>> unreadCount(@CurrentUser User user) {
        long count = notificationService.unreadCount(user.getId());
        ApiResponse<Map<String, Long>> body = ApiResponse.<Map<String, Long>>builder()
                .success(true)
                .message("Unread count")
                .data(Map.of("count", count))
                .timestamp(Instant.now())
                .build();
        return ResponseEntity.ok(body);
    }

    @PatchMapping("/read-all")
    @PreAuthorize("isAuthenticated() and principal.emailVerified == true")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> markAllRead(@CurrentUser User user) {
        int updated = notificationService.markAllAsRead(user.getId());
        ApiResponse<Map<String, Integer>> body = ApiResponse.<Map<String, Integer>>builder()
                .success(true)
                .message("All notifications marked as read")
                .data(Map.of("updated", updated))
                .timestamp(Instant.now())
                .build();
        return ResponseEntity.ok(body);
    }
}
