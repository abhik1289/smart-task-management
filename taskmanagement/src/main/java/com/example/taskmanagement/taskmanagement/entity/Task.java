package com.example.taskmanagement.taskmanagement.entity;

import com.example.taskmanagement.taskmanagement.entity.enums.Priority;
import com.example.taskmanagement.taskmanagement.entity.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "task", indexes = {
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_priority", columnList = "priority"),
        @Index(name = "idx_due_date", columnList = "dueDate")
})
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)

    private Priority priority;
    @Column(nullable = false)

    private LocalDateTime dueDate;

    @ManyToOne(fetch = FetchType.LAZY )
    @JoinColumn(name = "assign_by")
    private User assignBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assign_to")
    private User assignTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @Column(nullable = false)
    private boolean completed;

    @Column(nullable = false)
    private LocalDateTime assignDate;

    @Column(nullable = true)
    private LocalDateTime completedDate;

    @CreationTimestamp
    private LocalDateTime createdDate;
    @UpdateTimestamp
    private LocalDateTime updatedDate;

}
