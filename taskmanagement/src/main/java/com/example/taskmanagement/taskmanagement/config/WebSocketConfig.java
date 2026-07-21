package com.example.taskmanagement.taskmanagement.config;

import com.example.taskmanagement.taskmanagement.security.JwtHandshakeInterceptor;
import com.example.taskmanagement.taskmanagement.security.WebSocketAuthenticator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.context.annotation.Bean;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;
    private final WebSocketAuthenticator webSocketAuthenticator;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Native WebSocket endpoint with SockJS fallback disabled for simplicity;
        // clients (e.g. @stomp/stompjs) connect with the JWT in the
        // `Authorization` header during the CONNECT frame.
        registry.addEndpoint("/ws")
                .addInterceptors(jwtHandshakeInterceptor)
                .setHandshakeHandler(webSocketAuthenticator)
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Server pushes messages to clients subscribed to /user/queue/notifications
        registry.enableSimpleBroker("/queue", "/topic")
                .setTaskScheduler(heartbeatScheduler())
                .setHeartbeatValue(new long[] { 10000, 10000 });

        // Client-to-server messages prefixed with /app
        registry.setApplicationDestinationPrefixes("/app");

        // One-to-one messaging uses /user/{username}/queue/...
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // No additional interceptors for now; auth is performed at handshake.
    }

    @Bean
    public TaskScheduler heartbeatScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(1);
        scheduler.setThreadNamePrefix("ws-heartbeat-");
        scheduler.initialize();
        return scheduler;
    }
}
