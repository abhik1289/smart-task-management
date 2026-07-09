package com.example.taskmanagement.taskmanagement.service;

import com.example.taskmanagement.taskmanagement.dto.WorkSpaceRequest;
import com.example.taskmanagement.taskmanagement.entity.User;
import com.example.taskmanagement.taskmanagement.entity.Workspace;
import com.example.taskmanagement.taskmanagement.entity.WorkspaceMember;
import com.example.taskmanagement.taskmanagement.entity.enums.JoiningStatus;
import com.example.taskmanagement.taskmanagement.entity.enums.WorkspaceRole;
import com.example.taskmanagement.taskmanagement.exception.BadException;
import com.example.taskmanagement.taskmanagement.exception.UserNotFoundException;
import com.example.taskmanagement.taskmanagement.repository.UserRepository;
import com.example.taskmanagement.taskmanagement.repository.WorkSpaceMemberRepository;
import com.example.taskmanagement.taskmanagement.repository.WorkSpaceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkSpaceService {

    private static final String JOIN_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int JOIN_CODE_LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final WorkSpaceRepository workSpaceRepository;
    private final UserRepository userRepository;
    private final WorkSpaceMemberRepository workSpaceMemberRepository;

    public List<Workspace> findAllByOwnerId(Long ownerId) {
        return workSpaceRepository.findAllByOwnerId(ownerId);
    }

    public Workspace findById(Long id) {
        return workSpaceRepository.findById(id)
                .orElseThrow(() -> new BadException("Workspace not found"));
    }

    @Transactional
    public Workspace createWorkspace(WorkSpaceRequest workSpaceRequest, Long userId) {

        String refinedName = workSpaceRequest.getName() == null ? null : workSpaceRequest.getName().trim();
        if (refinedName == null || refinedName.isBlank()) {
            throw new BadException("Workspace name is required");
        }

        if (workSpaceRepository.existsByNameIgnoreCaseAndOwnerId(refinedName, userId)) {
            throw new BadException("Workspace already exists with name " + refinedName);
        }

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String refinedDescription = workSpaceRequest.getDescription() == null
                || workSpaceRequest.getDescription().isBlank()
                ? null
                : workSpaceRequest.getDescription().trim();

        Workspace workspace = Workspace.builder()
                .name(refinedName)
                .description(refinedDescription)
                .joinCode(generateUniqueJoinCode())
                .owner(owner)
                .build();

        Workspace saved = workSpaceRepository.save(workspace);

        WorkspaceMember ownerMember = WorkspaceMember.builder()
                .user(owner)
                .workspace(saved)
                .role(WorkspaceRole.OWNER)
                .joiningStatus(JoiningStatus.ACCEPTED)
                .build();
        workSpaceMemberRepository.save(ownerMember);

        return saved;
    }

    private String generateUniqueJoinCode() {
        for (int attempt = 0; attempt < 10; attempt++) {
            String candidate = randomJoinCode();
            if (!workSpaceRepository.existsByJoinCode(candidate)) {
                return candidate;
            }
        }
        throw new BadException("Could not generate a unique workspace join code, please retry");
    }

    private String randomJoinCode() {
        StringBuilder sb = new StringBuilder(JOIN_CODE_LENGTH);
        for (int i = 0; i < JOIN_CODE_LENGTH; i++) {
            sb.append(JOIN_CODE_ALPHABET.charAt(RANDOM.nextInt(JOIN_CODE_ALPHABET.length())));
        }
        return sb.toString();
    }

    public void deleteWorkspace(Long id) {
        // TODO: implement delete workspace flow
    }

    /**
     * Verify that the given user is the {@link WorkspaceRole#OWNER owner} of the
     * workspace. Throws {@link BadException} (mapped to HTTP 400 by
     * {@link com.example.taskmanagement.taskmanagement.exception.GlobalExceptionHandler})
     * if the user is not a member at all, or if they are a member but not the owner.
     */
    public void validateOwner(Long userId, Long workSpaceId) {

        WorkspaceMember member = workSpaceMemberRepository
                .findByWorkspaceIdAndUserId(workSpaceId, userId)
                .orElseThrow(() -> new BadException(
                        "You are not a member of this workspace"));

        if (member.getRole() != WorkspaceRole.OWNER) {
            throw new BadException(
                    "Only the workspace owner can perform this action");
        }
    }

    @Transactional
    public WorkspaceMember addMembersToWorkspace(Long workSpaceId, Long inviteeId, Long inviterId) {

        validateOwner(inviterId, workSpaceId);

        Workspace workspace = workSpaceRepository.findById(workSpaceId)
                .orElseThrow(() -> new BadException("Workspace not found"));

        if (workSpaceMemberRepository.existsByWorkspaceIdAndUserId(workSpaceId, inviteeId)) {
            throw new BadException("User is already a member of this workspace");
        }

        User invitee = userRepository.findById(inviteeId)
                .orElseThrow(() -> new UserNotFoundException("Invitee user not found"));

        WorkspaceMember workspaceMember = WorkspaceMember.builder()
                .workspace(workspace)
                .user(invitee)
                .role(WorkspaceRole.USER)
                .joiningStatus(JoiningStatus.INVITED)
                .build();

        return workSpaceMemberRepository.save(workspaceMember);
    }

    @Transactional
    public WorkspaceMember editWorkspaceMemberRole(Long ownerId, Long userId, Long workspaceId,
                                                   WorkspaceRole workspaceRole) {
        validateOwner(ownerId, workspaceId);

        Workspace workspace = workSpaceRepository.findById(workspaceId)
                .orElseThrow(() -> new BadException("Workspace not found"));


        WorkspaceMember existing = workSpaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new BadException("User is not a member of this workspace"));

        if (existing.getRole() != workspaceRole) {
            throw new BadException("The workspace role is not the same as the current role");
        }

        existing.setRole(workspaceRole);
        return workSpaceMemberRepository.save(existing);
    }

    @Transactional
    public WorkspaceMember acceptWorkSpaceJoining(Long workSpaceId, Long userId) {

        WorkspaceMember member = workSpaceMemberRepository
                .findByWorkspaceIdAndUserId(workSpaceId, userId)
                .orElseThrow(() -> new BadException("No pending invitation for this workspace"));

        if (member.getJoiningStatus() != JoiningStatus.INVITED) {
            throw new BadException("No pending invitation for this workspace");
        }

        member.setJoiningStatus(JoiningStatus.ACCEPTED);
        return workSpaceMemberRepository.save(member);
    }

    @Transactional
    public WorkspaceMember rejectWorkSpaceJoining(Long workSpaceId, Long userId) {

        WorkspaceMember member = workSpaceMemberRepository
                .findByWorkspaceIdAndUserId(workSpaceId, userId)
                .orElseThrow(() -> new BadException("No pending invitation for this workspace"));

        if (member.getJoiningStatus() != JoiningStatus.INVITED) {
            throw new BadException("No pending invitation for this workspace");
        }

        member.setJoiningStatus(JoiningStatus.REJECTED);
        return workSpaceMemberRepository.save(member);
    }

    public Page<WorkspaceMember> findMembersByWorkSpaceId(Long workSpaceId, Pageable pageable) {
        workSpaceRepository.findById(workSpaceId)
                .orElseThrow(() -> new BadException("Workspace not found"));
        return workSpaceMemberRepository.findAllByWorkspaceId(pageable, workSpaceId);
    }

    @Transactional
    public WorkspaceMember joinWorkspace(Long userId, Long workSpaceId, String joinCode) {

        Workspace workspace = workSpaceRepository.findById(workSpaceId)
                .orElseThrow(() -> new BadException("Workspace not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (workSpaceMemberRepository.existsByWorkspaceIdAndUserId(workSpaceId, userId)) {
            throw new BadException("User is already a member of this workspace");
        }

        WorkspaceMember workspaceMember = WorkspaceMember.builder()
                .joiningStatus(JoiningStatus.ACCEPTED)
                .role(WorkspaceRole.USER)
                .user(user)
                .workspace(workspace)
                .build();
        return workSpaceMemberRepository.save(workspaceMember);
    }

    @Transactional
    public Workspace updateWorkspace(Long userId, Long workSpaceId, Workspace workspace) {


        validateOwner(userId, workSpaceId);

        String title = workspace.getName().trim();
        String description = !workspace.getDescription().isBlank() ? workspace.getDescription() : "";



    }

}
