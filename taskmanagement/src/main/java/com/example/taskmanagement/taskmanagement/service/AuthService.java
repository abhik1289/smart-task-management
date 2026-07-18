package com.example.taskmanagement.taskmanagement.service;

import com.example.taskmanagement.taskmanagement.config.JwtConfig;
import com.example.taskmanagement.taskmanagement.dto.ActiveAccountRequest;
import com.example.taskmanagement.taskmanagement.dto.LoginRequest;
import com.example.taskmanagement.taskmanagement.dto.RegistrationRequest;
import com.example.taskmanagement.taskmanagement.dto.RefreshTokenRequest;
import com.example.taskmanagement.taskmanagement.dto.response.ActiveAccountResponse;
import com.example.taskmanagement.taskmanagement.dto.response.AuthResponse;
import com.example.taskmanagement.taskmanagement.dto.response.UserResponse;
import com.example.taskmanagement.taskmanagement.entity.RefreshToken;
import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.entity.enums.Provider;
import com.example.taskmanagement.taskmanagement.entity.enums.Roles;
import com.example.taskmanagement.taskmanagement.exception.BadException;
import com.example.taskmanagement.taskmanagement.exception.EmailAlreadyExistsException;
import com.example.taskmanagement.taskmanagement.repository.RefreshTokenRepository;
import com.example.taskmanagement.taskmanagement.repository.UserRepository;
import com.example.taskmanagement.taskmanagement.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtConfig jwtConfig;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail() == null ? null : loginRequest.getEmail().trim().toLowerCase();
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword()));

        User user = (User) auth.getPrincipal();
        revokeAllRefreshTokensForUser(user);

        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .access_token(accessToken)
                .refresh_token(refreshToken.getToken())
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadException("Invalid refresh token"));

        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadException("Refresh token expired or invalid");
        }

        revokeToken(refreshToken);
        User user = refreshToken.getUser();

        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken newRefreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .access_token(accessToken)
                .refresh_token(newRefreshToken.getToken())
                .build();
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(this::revokeToken);
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(jwtService.generateRefreshToken(user))
                .expiresAt(Instant.now().plusMillis(jwtConfig.getRefreshExpiration()))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    private void revokeToken(RefreshToken refreshToken) {
        refreshToken.setRevoked(true);
        refreshToken.setRevokedAt(Instant.now());
        refreshTokenRepository.save(refreshToken);
    }

    private void revokeAllRefreshTokensForUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    @Transactional
    public UserResponse registrationWithCredentials(RegistrationRequest registrationRequest) {
        String email = registrationRequest.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .name(registrationRequest.getName())
                .provider(Provider.LOCAL)
                .emailVerified(false)
                .role(Roles.USERS)
                .activationCode(otp)
                .activationCodeExpiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        User savedUser = userRepository.save(user);

        log.info("USER::------>", savedUser);

        emailService.sendActivationEmail(savedUser.getEmail(), savedUser.getName(), savedUser.getActivationCode());

        return UserResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .provider(savedUser.getProvider())
                .role(savedUser.getRole())
                .emailVerified(savedUser.isEmailVerified())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Transactional
    public void resendActivationCode(String email) {
        String refractorEmail = email.trim().toLowerCase();
        User user = findUserByEmail(refractorEmail);

        if (user.isEmailVerified()) {
            throw new BadException("Account already verified");
        }

        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);

        user.setActivationCode(otp);
        user.setActivationCodeExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendActivationEmail(user.getEmail(), user.getName(), user.getActivationCode());
    }

    @Transactional
    public ActiveAccountResponse activeAccount(String email, ActiveAccountRequest req) {
        String refractorEmail = email.trim().toLowerCase();
        User user = findUserByEmail(refractorEmail);

        if (user.isEmailVerified() || user.getActivationCode() == null || user.getActivationCodeExpiresAt() == null) {
            throw new BadException("Account already verified");
        }

        if (user.getActivationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadException("Activation code expired");
        }

        int refineOtp = Integer.parseInt(req.getOtp());
        boolean isValidOtp = refineOtp == user.getActivationCode();

        if (isValidOtp) {
            user.setActivationCode(null);
            user.setActivationCodeExpiresAt(null);
            user.setEmailVerified(true);
            userRepository.save(user);

            return ActiveAccountResponse.builder()
                    .userEmail(refractorEmail)
                    .message("Activated")
                    .build();
        } else {
            throw new BadException("Invalid OTP");
        }
    }
}
