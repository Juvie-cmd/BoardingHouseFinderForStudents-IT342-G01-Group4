package com.boardinghouse.controller;

import com.boardinghouse.dto.ApiResponse;
import com.boardinghouse.dto.ChangePasswordRequest;
import com.boardinghouse.dto.ProfileUpdateRequest;
import com.boardinghouse.dto.UserProfileResponse;
import com.boardinghouse.entity.User;
import com.boardinghouse.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserProfileResponse profile = profileService.getProfile(user.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        User user = (User) authentication.getPrincipal();
        UserProfileResponse profile = profileService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        User user = (User) authentication.getPrincipal();
        profileService.changePassword(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        profileService.deleteProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile deleted successfully"));
    }
}