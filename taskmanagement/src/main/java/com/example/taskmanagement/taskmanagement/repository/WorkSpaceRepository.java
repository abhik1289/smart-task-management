package com.example.taskmanagement.taskmanagement.repository;

import com.example.taskmanagement.taskmanagement.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkSpaceRepository extends JpaRepository<Workspace, Long> {

    List<Workspace> findAllByOwnerId(Long ownerId);

    boolean existsByNameAndOwnerId(String name, Long ownerId);

    boolean existsByNameIgnoreCaseAndOwnerId(String name, Long ownerId);

    boolean existsByIdAndOwnerIdAndNameNot(Long id, Long ownerId, String name);

    boolean existsByJoinCode(String joinCode);

}