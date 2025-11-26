package com.boardinghouse.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String name;
    private String email;
    private String role;
    private Boolean active;
    private String phone;
}