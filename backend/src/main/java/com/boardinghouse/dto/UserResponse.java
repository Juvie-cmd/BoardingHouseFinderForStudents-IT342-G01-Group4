package com.boardinghouse.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Boolean active;
    private String phone;
    private LocalDateTime createdAt;
    private String joinDate;
}