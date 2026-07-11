package com.example.taskmanagement.taskmanagement.controller;

import com.example.taskmanagement.taskmanagement.dto.UpdateProfileRequest;
import com.example.taskmanagement.taskmanagement.dto.response.ApiResponse;
import com.example.taskmanagement.taskmanagement.dto.response.UserResponse;
import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.security.CurrentUser;
import com.example.taskmanagement.taskmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/admin")
    public List<User> findAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable Long id) {
        Long refineId = Long.parseLong(id.toString());
        return userService.findById(refineId);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@CurrentUser User user) {
        UserResponse profile = toUserResponse(user);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Profile fetched successfully")
                .data(profile)
                .timestamp(Instant.now())
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            @CurrentUser User user,
            @RequestBody UpdateProfileRequest updateRequest) {
        User updatedUser = userService.updateProfile(user.getId(), updateRequest);
        UserResponse profile = toUserResponse(updatedUser);
        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(profile)
                .timestamp(Instant.now())
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider())
                .emailVerified(user.isEmailVerified())
                .imageUrl(user.getImageUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
