package com.boardinghouse.controller;

import com.boardinghouse.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse> getProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserProfileResponse profile = profileService.getProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        User user = (User) authentication.getPrincipal();
        UserProfileResponse profile = profileService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        profileService.deleteProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile deleted successfully"));
    }
}
