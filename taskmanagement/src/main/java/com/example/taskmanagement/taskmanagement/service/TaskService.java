package com.example.taskmanagement.taskmanagement.service;

import com.example.taskmanagement.taskmanagement.entity.Task;
import com.example.taskmanagement.taskmanagement.exception.BadException;
import com.example.taskmanagement.taskmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Task findById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new BadException("task not found"));
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

    public void createTask(Task task) {
        taskRepository.save(task);
    }
}
