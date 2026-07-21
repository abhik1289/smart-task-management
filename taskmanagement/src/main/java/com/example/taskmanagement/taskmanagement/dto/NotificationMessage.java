package com.example.taskmanagement.taskmanagement.dto;

import com.example.taskmanagement.taskmanagement.dto.response.NotificationResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Message placed on RabbitMQ. It contains the user who should receive the
 * notification and the payload that will be sent to the WebSocket client.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage implements Serializable {

    private String recipientEmail;
    private NotificationResponse notification;
}
