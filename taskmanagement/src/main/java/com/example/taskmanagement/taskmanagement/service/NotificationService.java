package com.example.taskmanagement.taskmanagement.service;

import com.example.taskmanagement.taskmanagement.dto.NotificationMessage;
import com.example.taskmanagement.taskmanagement.dto.response.NotificationResponse;
import com.example.taskmanagement.taskmanagement.producer.NotificationProducer;
import com.example.taskmanagement.taskmanagement.entity.Notification;
import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.entity.enums.NotificationType;
import com.example.taskmanagement.taskmanagement.exception.UserNotFoundException;
import com.example.taskmanagement.taskmanagement.repository.NotificationRepository;
import com.example.taskmanagement.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationProducer notificationProducer;

    /**
     * Persist a notification and publish it to RabbitMQ. The RabbitMQ consumer
     * sends it to the recipient through WebSocket. No-op if the recipient is missing or is the same as the actor
     * (we don't want to notify yourself).
     */
    @Transactional
    public Notification push(Long recipientId, Long actorId, NotificationType type,
                             String message, Long referenceId, String referenceType) {

        if (recipientId == null) {
            return null;
        }
        if (actorId != null && actorId.equals(recipientId)) {
            return null;
        }

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new UserNotFoundException("Recipient not found: " + recipientId));

        User actor = null;
        if (actorId != null) {
            actor = userRepository.findById(actorId).orElse(null);
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .read(false)
                .build();

        Notification saved = notificationRepository.save(notification);

        NotificationResponse payload = NotificationResponse.fromEntity(saved);
        notificationProducer.send(new NotificationMessage(recipient.getEmail(), payload));
        log.info("Notification added to RabbitMQ for user {}", recipient.getEmail());

        return saved;
    }

    public Page<NotificationResponse> listForUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository
                .findAllByRecipientIdOrderByCreatedAtDesc(userId, pageable)
                .map(NotificationResponse::fromEntity);
    }

    public long unreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    @Transactional
    public int markAllAsRead(Long userId) {
        return notificationRepository.markAllAsRead(userId);
    }
}
