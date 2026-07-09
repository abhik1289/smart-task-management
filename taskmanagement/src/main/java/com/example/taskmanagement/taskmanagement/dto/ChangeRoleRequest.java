package com.example.taskmanagement.taskmanagement.dto;

import com.example.taskmanagement.taskmanagement.entity.enums.WorkspaceRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request body for
 * {@code PATCH /workspace/{workspaceId}/members/role/{userId}}.
 *
 * <p>Only the target {@link WorkspaceRole} travels in the body. Workspace id and
 * user id are taken from the URL path so they cannot drift from the request
 * target.</p>
 */
@Data
public class ChangeRoleRequest {

    @NotNull(message = "role is required")
    private WorkspaceRole role;


}
