package com.boardinghouse.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String bio;

    // Student-specific fields
    private String university;
    private String yearOfStudy;
    private Integer budget;
    private String preferredLocation;
    private String roomType;

    // Landlord-specific fields
    private String businessName;
    private String businessAddress;
    private String taxId;
    private String bankAccount;
    private String website;
    private Integer experience;

    // Admin-specific fields
    private String department;
    private String employeeId;
}
