package com.example.taskmanagement.taskmanagement.dto.response;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkSpaceResponse {
    private String id;
    private String name;
    private String description;
    private LocalDateTime creationDate;
    private LocalDateTime updateDate;
    private String joinCode;
}
