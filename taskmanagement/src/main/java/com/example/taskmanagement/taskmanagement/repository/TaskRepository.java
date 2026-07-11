package com.example.taskmanagement.taskmanagement.repository;

import com.example.taskmanagement.taskmanagement.entity.Task;
import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.entity.enums.WorkspaceRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // List<Task> findAllByAssignToId(Long id);

    Page<Task> findAllByAssignToIdAndWorkspaceId(Pageable pageable, Long userId, Long workspaceId);

    Page<Task> findAllByWorkspaceId(Pageable pageable, Long workspaceId);

    Page<Task> findAllByWorkspaceIdAndCompleted(Long workspaceId, boolean completed, Pageable pageable);

}
