package com.boardinghouse.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String type; // "Bearer"
    private Long id;
    private String name;
    private String email;
    private String role;
    private String message;
}
