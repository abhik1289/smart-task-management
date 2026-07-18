package com.example.taskmanagement.taskmanagement.controller;

import com.example.taskmanagement.taskmanagement.dto.ActiveAccountRequest;
import com.example.taskmanagement.taskmanagement.dto.LoginRequest;
import com.example.taskmanagement.taskmanagement.dto.RefreshTokenRequest;
import com.example.taskmanagement.taskmanagement.dto.RegistrationRequest;
import com.example.taskmanagement.taskmanagement.dto.response.ActiveAccountResponse;
import com.example.taskmanagement.taskmanagement.dto.response.ApiResponse;
import com.example.taskmanagement.taskmanagement.dto.response.AuthResponse;
import com.example.taskmanagement.taskmanagement.dto.response.UserResponse;
import com.example.taskmanagement.taskmanagement.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);

        ApiResponse<AuthResponse> apiResponse = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("login successful")
                .data(authResponse)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/sign-up")
    ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegistrationRequest req) {

        UserResponse response = authService.registrationWithCredentials(req);

        log.info("Response Email:::---> {}", response.getEmail());

        ApiResponse<UserResponse> apiResponse = ApiResponse.<UserResponse>builder()
                .success(true)
                .message("registration successful")
                .data(response)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PostMapping("/activate/{userEmail}")
    public ResponseEntity<ApiResponse<ActiveAccountResponse>> activateUser(@PathVariable String userEmail,
            @Valid @RequestBody ActiveAccountRequest otp) {

        ActiveAccountResponse response = authService.activeAccount(userEmail, otp);

        ApiResponse<ActiveAccountResponse> apiResponse = ApiResponse.<ActiveAccountResponse>builder()
                .success(true)
                .message("activation successful")
                .data(response)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/resend-activation/{userEmail}")
    public ResponseEntity<ApiResponse<Void>> resendActivation(@PathVariable String userEmail) {
        authService.resendActivationCode(userEmail);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("activation code resent")
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse authResponse = authService.refreshToken(request);

        ApiResponse<AuthResponse> apiResponse = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("token refreshed")
                .data(authResponse)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("logout successful")
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
