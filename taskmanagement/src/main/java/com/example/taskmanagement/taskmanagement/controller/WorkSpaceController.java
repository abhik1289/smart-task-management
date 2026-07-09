package com.example.taskmanagement.taskmanagement.controller;

import com.example.taskmanagement.taskmanagement.dto.ChangeRoleRequest;
import com.example.taskmanagement.taskmanagement.dto.WorkSpaceRequest;
import com.example.taskmanagement.taskmanagement.dto.response.ApiResponse;
import com.example.taskmanagement.taskmanagement.dto.response.WorkSpaceResponse;
import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.entity.Workspace;
import com.example.taskmanagement.taskmanagement.entity.WorkspaceMember;
import com.example.taskmanagement.taskmanagement.entity.enums.WorkspaceRole;
import com.example.taskmanagement.taskmanagement.security.CurrentUser;
import com.example.taskmanagement.taskmanagement.service.WorkSpaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/workspace")
@RequiredArgsConstructor
public class WorkSpaceController {

    private final WorkSpaceService workSpaceService;
    private final ModelMapper modelMapper;

    /**
     * Accept both {@code POST /workspace} and {@code POST /workspace/} so
     * clients (Postman, browsers, frontend) don't trip on the trailing
     * slash.
     */
    @PostMapping(value = {"", "/"})
    @PreAuthorize("hasRole('USERS') and principal.emailVerified == true")
    public ResponseEntity<ApiResponse<WorkSpaceResponse>> createWorkspace(
            @Valid @RequestBody WorkSpaceRequest workSpaceRequest,
            @CurrentUser User user) {

        Workspace workspace = workSpaceService.createWorkspace(workSpaceRequest, user.getId());

        WorkSpaceResponse body = modelMapper.map(workspace, WorkSpaceResponse.class);

        ApiResponse<WorkSpaceResponse> apiResponse = ApiResponse.<WorkSpaceResponse>builder()
                .success(true)
                .message("Workspace Created")
                .data(body)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkSpaceResponse>> getWorkSpace(@PathVariable String
                                                                               id) {

        Long workspaceId = Long.parseLong(id);

        Workspace workspace = workSpaceService.findById(workspaceId);

        WorkSpaceResponse body = modelMapper.map(workspace, WorkSpaceResponse.class);

        ApiResponse<WorkSpaceResponse> apiResponse = ApiResponse.<WorkSpaceResponse>builder()
                .timestamp(Instant.now())
                .data(body)
                .success(true)
                .message("Workspace Found")
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);

    }

    //
    @GetMapping("/{userId}/workspace")
    public ResponseEntity<ApiResponse<List<WorkSpaceResponse>>> workSpaceByUserId(@PathVariable String userId) {

        Long refinedUserId = Long.parseLong(userId);

        List<Workspace> workspaceList = workSpaceService.findAllByOwnerId(refinedUserId);

        List<WorkSpaceResponse> body = workspaceList.stream()
                .map(workspace -> modelMapper.map(workspace, WorkSpaceResponse.class)).toList();

        ApiResponse<List<WorkSpaceResponse>> apiResponse = ApiResponse.<List<WorkSpaceResponse>>builder()
                .message("Workspace List")
                .success(true)
                .data(body)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);

    }

    @PatchMapping("/{workspaceId}/members/invite/{userId}")
    @PreAuthorize("isAuthenticated() and principal.emailVerified == true")
    public ResponseEntity<ApiResponse<Void>> inviteMember(
            @PathVariable Long workspaceId,
            @PathVariable Long userId,
            @CurrentUser User inviter) {

        log.info("User id={} inviting user id={} into workspace id={}",
                inviter.getId(), userId, workspaceId);

        workSpaceService.addMembersToWorkspace(workspaceId, userId, inviter.getId());

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .timestamp(Instant.now())
                .message("Invitation sent")
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PatchMapping("/{workspaceId}/members/accept")
    public ResponseEntity<ApiResponse<Void>> acceptMemberRequest(@PathVariable Long workspaceId,
                                                                 @CurrentUser User user) {

        Long userId = user.getId();

        workSpaceService.acceptWorkSpaceJoining(workspaceId, userId);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .timestamp(Instant.now())
                .message("Request Accepted")
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    //
    @PatchMapping("/{workspaceId}/members/reject")
    public ResponseEntity<ApiResponse<Void>> rejectMemberMemberRequest(
            @PathVariable Long workspaceId,
            @CurrentUser User user
    ) {
        Long userId = user.getId();

        workSpaceService.rejectWorkSpaceJoining(workspaceId, userId);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .timestamp(Instant.now())
                .message("Successfully rejected request")
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);

    }

    //
    @PatchMapping("/{workspaceId}/members/role/{userId}")
    public ResponseEntity<ApiResponse<Void>> changeMemberRole(@PathVariable Long workspaceId,
                                                              @PathVariable Long userId,
                                                              @CurrentUser User user,
                                                              @RequestBody ChangeRoleRequest changeRoleRequest
    ) {


        WorkspaceRole role = changeRoleRequest.getRole();
        Long ownerUserId = user.getId();

        workSpaceService.editWorkspaceMemberRole(ownerUserId, userId, workspaceId, role);

        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .timestamp(Instant.now())
                .message("Successfully updated role")
                .success(true)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);


    }

    //
    @GetMapping("/{workspaceId}/members/{userId}")
    public ResponseEntity<ApiResponse<Page<WorkspaceMember>>> inviteMember(@PathVariable Long workspaceId,

                                                                           @RequestParam(defaultValue = "10") int size,
                                                                           @RequestParam(defaultValue = "0") int page) {

        Pageable pageable = PageRequest.of(page, size);

        Page<WorkspaceMember> member = workSpaceService.findMembersByWorkSpaceId(workspaceId, pageable);

        ApiResponse<Page<WorkspaceMember>> members = ApiResponse.<Page<WorkspaceMember>>builder()
                .timestamp(Instant.now())
                .message("Member List")
                .success(true)
                .data(member)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(members);

    }

     @PatchMapping("/{workspaceId}/members/{userId}/remove")
     public ResponseEntity inviteMember(@CurrentUser User user, @PathVariable Long userId) {

        Long uerId  = user.getId();

        workSpaceService.r



     }
    //
     @PatchMapping("/{workspaceId}/members/{userId}/leave")
     public ResponseEntity inviteMember() {

     }

     @PutMapping("/{workspaceId}")
    public ResponseEntity updateWorkSpce(@PathVariable Long workspaceId, @RequestBody WorkSpaceRequest workSpaceRequest) {



     }
    //

}