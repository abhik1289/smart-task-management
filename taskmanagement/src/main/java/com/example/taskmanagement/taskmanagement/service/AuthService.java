package com.example.taskmanagement.taskmanagement.service;

import com.example.taskmanagement.taskmanagement.dto.ActiveAccountRequest;
import com.example.taskmanagement.taskmanagement.dto.LoginRequest;
import com.example.taskmanagement.taskmanagement.dto.LoginResponse;
import com.example.taskmanagement.taskmanagement.dto.RegistrationRequest;
import com.example.taskmanagement.taskmanagement.dto.response.ActiveAccountResponse;
import com.example.taskmanagement.taskmanagement.dto.response.AuthResponse;
import com.example.taskmanagement.taskmanagement.dto.response.UserResponse;
import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.entity.enums.Provider;
import com.example.taskmanagement.taskmanagement.entity.enums.Roles;
import com.example.taskmanagement.taskmanagement.exception.BadException;
import com.example.taskmanagement.taskmanagement.exception.EmailAlreadyExistsException;
import com.example.taskmanagement.taskmanagement.repository.UserRepository;
import com.example.taskmanagement.taskmanagement.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail() == null ? null : loginRequest.getEmail().trim().toLowerCase();
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword()));

        User user = (User) auth.getPrincipal();

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .access_token(accessToken)
                .refresh_token(refreshToken)
                .build();

    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

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


    public ActiveAccountResponse activeAccount(String email, ActiveAccountRequest req) {


        String refractorEmail = email.trim().toLowerCase();

        //check exists or not
        User user = findUserByEmail(refractorEmail);

        //check account status

        if (user.isEmailVerified() || user.getActivationCode() == null || user.getActivationCodeExpiresAt() == null) {
            throw new BadException("Account already verified");
        }

        //check token expired or not

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
