package com.example.taskmanagement.taskmanagement.security;

import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

/**
 * Builds the {@link Principal} for the WebSocket session from the
 * {@code username} attribute stashed by {@link JwtHandshakeInterceptor}.
 * The principal's name is the user's email, matching the value used by
 * the user destination resolver ({@code /user/{email}/queue/...}).
 */
@Component
@RequiredArgsConstructor
public class WebSocketAuthenticator extends DefaultHandshakeHandler {

    private final UserRepository userRepository;

    @Override
    protected Principal determineUser(ServerHttpRequest request,
                                      WebSocketHandler wsHandler,
                                      Map<String, Object> attributes) {
        Object usernameAttr = attributes.get(JwtHandshakeInterceptor.ATTR_USERNAME);
        if (!(usernameAttr instanceof String username) || username.isBlank()) {
            return null;
        }
        User user = userRepository.findByEmail(username.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Authenticate for the duration of the handshake so downstream
        // security-aware components can rely on SecurityContextHolder.
        Authentication auth = new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        return auth;
    }
}
