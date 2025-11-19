package com.boardinghouse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoogleAuthRequest {
    @NotBlank(message = "ID token is required")
    private String idToken;
    
    @NotBlank(message = "Role is required")
    private String role; // student, landlord, admin
}