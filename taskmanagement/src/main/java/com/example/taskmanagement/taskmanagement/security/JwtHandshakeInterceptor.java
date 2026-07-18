package com.example.taskmanagement.taskmanagement.security;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * Validates the JWT during the WebSocket handshake. The token is expected in
 * the {@code Authorization} header ({@code Bearer ...}) or the
 * {@code token} query parameter. On success, the resolved username is stored
 * as a handshake attribute so the {@link WebSocketAuthenticator} can build the
 * Spring Security principal.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    public static final String ATTR_USERNAME = "username";

    private final JwtService jwtService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {

        String token = extractToken(request);

        if (!StringUtils.hasText(token)) {
            log.debug("WebSocket handshake rejected: missing JWT");
            response.setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
            return false;
        }

        try {
            String username = jwtService.extractUsername(token);
            if (username == null || username.isBlank()) {
                response.setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                return false;
            }
            attributes.put(ATTR_USERNAME, username);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("WebSocket handshake rejected: invalid JWT - {}", ex.getMessage());
            response.setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
            return false;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // no-op
    }

    private String extractToken(ServerHttpRequest request) {
        String header = request.getHeaders().getFirst("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        if (request instanceof ServletServerHttpRequest servletRequest) {
            String tokenParam = servletRequest.getServletRequest().getParameter("token");
            if (StringUtils.hasText(tokenParam)) {
                return tokenParam;
            }
        }
        return null;
    }
}
