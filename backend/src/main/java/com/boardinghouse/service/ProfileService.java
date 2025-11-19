package com.boardinghouse.service;

import com.boardinghouse.dto.ProfileUpdateRequest;
import com.boardinghouse.dto.UserProfileResponse;
import com.boardinghouse.entity.User;
import com.boardinghouse.exception.ResourceNotFoundException;
import com.boardinghouse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserRepository userRepository;

    /** Get profile by user ID */
    public UserProfileResponse getProfile(Long userId) {
        log.info("Fetching profile for user ID: {}", userId);

        User user = userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToProfileResponse(user);
    }

    /** Update profile by user ID and ProfileUpdateRequest */
    @Transactional
    public UserProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        log.info("Updating profile for user ID: {}", userId);

        User user = userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update common fields
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        // Update role-specific fields
        switch (user.getRole().toLowerCase()) {
            case "student" -> updateStudentFields(user, request);
            case "landlord" -> updateLandlordFields(user, request);
            case "admin" -> updateAdminFields(user, request);
        }

        User updatedUser = userRepository.save(user);
        log.info("Profile updated successfully for user ID: {}", userId);

        return mapToProfileResponse(updatedUser);
    }

    /** Soft delete profile by user ID */
    @Transactional
    public void deleteProfile(Long userId) {
        log.info("Deleting profile for user ID: {}", userId);

        User user = userRepository.findByIdAndActiveTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setActive(false);
        userRepository.save(user);

        log.info("Profile deleted successfully for user ID: {}", userId);
    }

    /** Private helper methods for role-specific updates */
    private void updateStudentFields(User user, ProfileUpdateRequest request) {
        if (request.getUniversity() != null) user.setUniversity(request.getUniversity());
        if (request.getYearOfStudy() != null) user.setYearOfStudy(request.getYearOfStudy());
        if (request.getBudget() != null) user.setBudget(request.getBudget());
        if (request.getPreferredLocation() != null) user.setPreferredLocation(request.getPreferredLocation());
        if (request.getRoomType() != null) user.setRoomType(request.getRoomType());
    }

    private void updateLandlordFields(User user, ProfileUpdateRequest request) {
        if (request.getBusinessName() != null) user.setBusinessName(request.getBusinessName());
        if (request.getBusinessAddress() != null) user.setBusinessAddress(request.getBusinessAddress());
        if (request.getTaxId() != null) user.setTaxId(request.getTaxId());
        if (request.getBankAccount() != null) user.setBankAccount(request.getBankAccount());
        if (request.getWebsite() != null) user.setWebsite(request.getWebsite());
        if (request.getExperience() != null) user.setExperience(request.getExperience());
    }

    private void updateAdminFields(User user, ProfileUpdateRequest request) {
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getEmployeeId() != null) user.setEmployeeId(request.getEmployeeId());
    }

    /** Map User entity to UserProfileResponse DTO */
    private UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .bio(user.getBio())
                // Student fields
                .university(user.getUniversity())
                .yearOfStudy(user.getYearOfStudy())
                .budget(user.getBudget())
                .preferredLocation(user.getPreferredLocation())
                .roomType(user.getRoomType())
                // Landlord fields
                .businessName(user.getBusinessName())
                .businessAddress(user.getBusinessAddress())
                .taxId(user.getTaxId())
                .bankAccount(user.getBankAccount())
                .website(user.getWebsite())
                .experience(user.getExperience())
                // Admin fields
                .department(user.getDepartment())
                .employeeId(user.getEmployeeId())
                .build();
    }
}
