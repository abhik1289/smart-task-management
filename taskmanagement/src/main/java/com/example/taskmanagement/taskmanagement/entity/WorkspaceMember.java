package com.example.taskmanagement.taskmanagement.entity;

import com.example.taskmanagement.taskmanagement.entity.enums.JoiningStatus;
import com.example.taskmanagement.taskmanagement.entity.enums.WorkspaceRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "workspace_members", uniqueConstraints = {
                @UniqueConstraint(columnNames = { "workspace_id", "user_id" })
})
public class WorkspaceMember {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "workspace_id", nullable = false)
        private Workspace workspace;

        @Column(nullable = false)
        @Enumerated(EnumType.STRING)
        private WorkspaceRole role;

        @Column(nullable = false)
        @Enumerated(EnumType.STRING)
        private JoiningStatus joiningStatus;

        @CreationTimestamp
        private LocalDateTime createdAt;
        @UpdateTimestamp
        private LocalDateTime updatedAt;
}