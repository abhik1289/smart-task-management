package com.example.taskmanagement.taskmanagement.repository;

import com.example.taskmanagement.taskmanagement.entity.Workspace;
import com.example.taskmanagement.taskmanagement.entity.WorkspaceMember;
import com.example.taskmanagement.taskmanagement.entity.enums.WorkspaceRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkSpaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {


    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(Long workspaceId, Long ownerId);

    Page<WorkspaceMember> findAllByWorkspaceId(Pageable pageable, Long workspaceId);

    boolean existsByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    boolean existsByWorkspaceIdAndUserIdAndRole(Long workspaceId, Long userId, WorkspaceRole role);

//    Workspace update


}
