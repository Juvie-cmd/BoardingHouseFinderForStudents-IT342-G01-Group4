package com.boardinghouse.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    // Common fields
    private String name;
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
