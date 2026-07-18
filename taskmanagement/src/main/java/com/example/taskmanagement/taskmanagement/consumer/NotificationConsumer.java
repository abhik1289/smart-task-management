package com.example.taskmanagement.taskmanagement.consumer;

import com.example.taskmanagement.taskmanagement.config.RabbitMQConfig;
import com.example.taskmanagement.taskmanagement.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private static final String WS_DESTINATION = "/queue/notifications";

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * RabbitMQ calls this method whenever a notification message arrives.
     * The message is then pushed only to the intended user's WebSocket session.
     */
    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void receive(NotificationMessage message) {
        messagingTemplate.convertAndSendToUser(
                message.getRecipientEmail(),
                WS_DESTINATION,
                message.getNotification());

        log.info("Realtime notification sent to {}", message.getRecipientEmail());
    }
}
