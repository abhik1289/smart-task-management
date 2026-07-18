package com.example.taskmanagement.taskmanagement.service;

import com.example.taskmanagement.taskmanagement.dto.TaskRequest;
import com.example.taskmanagement.taskmanagement.entity.Task;
import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.entity.Workspace;
import com.example.taskmanagement.taskmanagement.entity.enums.NotificationType;
import com.example.taskmanagement.taskmanagement.entity.enums.Status;
import com.example.taskmanagement.taskmanagement.exception.BadException;
import com.example.taskmanagement.taskmanagement.exception.UserNotFoundException;
import com.example.taskmanagement.taskmanagement.repository.TaskRepository;
import com.example.taskmanagement.taskmanagement.repository.UserRepository;
import com.example.taskmanagement.taskmanagement.repository.WorkSpaceMemberRepository;
import com.example.taskmanagement.taskmanagement.repository.WorkSpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final WorkSpaceRepository workSpaceRepository;
    private final WorkSpaceMemberRepository workSpaceMemberRepository;
    private final WorkSpaceService workSpaceService;
    private final NotificationService notificationService;

    public Task findById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new BadException("Task not found"));
    }

    public Page<Task> findAllTaskByWorkspaceId(Long workspaceId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return taskRepository.findAllByWorkspaceId(pageable, workspaceId);
    }

    public Page<Task> findAllTaskByWorkspaceIdAndCompleted(Long workspaceId, boolean completed, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return taskRepository.findAllByWorkspaceIdAndCompleted(workspaceId, completed, pageable);
    }

    public Page<Task> findAllTaskByUserIdAndWorkspaceId(Long userId, Long workspaceId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return taskRepository.findAllByAssignToIdAndWorkspaceId(pageable, userId, workspaceId);
    }

    /** Create a task and notify the user who received the assignment. */
    @Transactional
    public Task createTask(Long workspaceId, TaskRequest request, User assigner) {
        workSpaceService.validateOwner(assigner.getId(), workspaceId);

        Workspace workspace = workSpaceRepository.findById(workspaceId)
                .orElseThrow(() -> new BadException("Workspace not found"));
        User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new UserNotFoundException("Assignee not found"));
        if (!workSpaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, assignee.getId())) {
            throw new BadException("Assignee must be a member of this workspace");
        }

        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setAssignBy(assigner);
        task.setAssignTo(assignee);
        task.setWorkspace(workspace);
        task.setStatus(Status.PENDING);
        task.setCompleted(false);
        task.setAssignDate(LocalDateTime.now());

        Task saved = taskRepository.save(task);

        notificationService.push(
                assignee.getId(),
                assigner.getId(),
                NotificationType.TASK_ASSIGNED,
                assigner.getName() + " assigned you the task: " + saved.getTitle(),
                saved.getId(),
                "TASK");

        return saved;
    }

    /** Mark a task complete and notify the person who assigned it. */
    @Transactional
    public Task completeTask(Long taskId, User completedBy) {
        Task task = findById(taskId);

        if (!task.getAssignTo().getId().equals(completedBy.getId())) {
            throw new BadException("Only the assigned user can complete this task");
        }
        if (task.isCompleted()) {
            throw new BadException("Task is already completed");
        }

        task.setCompleted(true);
        task.setStatus(Status.COMPLETED);
        task.setCompletedDate(LocalDateTime.now());
        Task saved = taskRepository.save(task);

        notificationService.push(
                task.getAssignBy().getId(),
                completedBy.getId(),
                NotificationType.TASK_COMPLETED,
                completedBy.getName() + " completed the task: " + saved.getTitle(),
                saved.getId(),
                "TASK");

        return saved;
    }
}
