package com.boardinghouse.controller;

import com.boardinghouse.dto.ListingResponse;
import com.boardinghouse.dto.RejectListingRequest;
import com.boardinghouse.dto.UserResponse;
import com.boardinghouse.dto.UserUpdateRequest;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.service.AdminService;
import com.boardinghouse.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    private final AdminService adminService;
    private final ListingService listingService;

    // ==================== USER MANAGEMENT ====================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        try {
            List<UserResponse> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.err.println("Error getting users: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/user/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request) {
        try {
            UserResponse updated = adminService.updateUser(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating user: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // ==================== LISTING MANAGEMENT ====================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/listings")
    public ResponseEntity<List<ListingResponse>> getAllListings() {
        try {
            List<Listing> listings = listingService.getAll();
            return ResponseEntity.ok(listingService.toResponseList(listings));
        } catch (Exception e) {
            System.err.println("Error getting listings: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/listing/{id}/approve")
    public ResponseEntity<ListingResponse> approveListing(@PathVariable Long id) {
        try {
            ListingResponse approved = adminService.approveListing(id);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            System.err.println("Error approving listing: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/listing/{id}/reject")
    public ResponseEntity<ListingResponse> rejectListing(
            @PathVariable Long id,
            @RequestBody(required = false) RejectListingRequest request) {
        try {
            String notes = request != null ? request.getRejectionNotes() : null;
            ListingResponse rejected = adminService.rejectListing(id, notes);
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            System.err.println("Error rejecting listing: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/listing/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        try {
            listingService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting listing: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}