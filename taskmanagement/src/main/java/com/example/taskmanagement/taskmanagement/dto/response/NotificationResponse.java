package com.example.taskmanagement.taskmanagement.dto.response;

import com.example.taskmanagement.taskmanagement.entity.Notification;
import com.example.taskmanagement.taskmanagement.entity.enums.NotificationType;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse implements Serializable {

    private Long id;
    private NotificationType type;
    private String message;
    private Long referenceId;
    private String referenceType;
    private boolean read;
    private LocalDateTime createdAt;
    private ActorSummary actor;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActorSummary implements Serializable {
        private Long id;
        private String name;
        private String email;
        private String imageUrl;
    }

    public static NotificationResponse fromEntity(Notification n) {
        ActorSummary actorSummary = null;
        if (n.getActor() != null) {
            actorSummary = ActorSummary.builder()
                    .id(n.getActor().getId())
                    .name(n.getActor().getName())
                    .email(n.getActor().getEmail())
                    .imageUrl(n.getActor().getImageUrl())
                    .build();
        }
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .message(n.getMessage())
                .referenceId(n.getReferenceId())
                .referenceType(n.getReferenceType())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .actor(actorSummary)
                .build();
    }
}
