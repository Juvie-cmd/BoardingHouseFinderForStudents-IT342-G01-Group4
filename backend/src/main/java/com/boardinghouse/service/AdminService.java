package com.boardinghouse. service;

import com.boardinghouse. dto.ListingResponse;
import com.boardinghouse.dto. UserResponse;
import com.boardinghouse.dto.UserUpdateRequest;
import com.boardinghouse.entity. Listing;
import com.boardinghouse.entity.User;
import com.boardinghouse.repository.ListingRepository;
import com.boardinghouse.repository. UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype. Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final ListingService listingService;

    /**
     * Get all users except admins
     */
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> !"admin".equalsIgnoreCase(user.getRole()))
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update a user's information
     */
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if ("admin".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Cannot modify admin accounts");
        }

        if (request.getRole() != null && "admin".equalsIgnoreCase(request. getRole())) {
            throw new RuntimeException("Cannot assign admin role to users");
        }

        if (request.getName() != null && ! request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (! user.getEmail(). equals(request.getEmail()) && 
                userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }
        if (request. getRole() != null && ! request.getRole(). isBlank()) {
            user.setRole(request.getRole(). toLowerCase());
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }
        if (request.getPhone() != null) {
            user. setPhone(request. getPhone());
        }

        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    /**
     * Delete a user
     */
    public void deleteUser(Long id) {
        User user = userRepository. findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if ("admin". equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Cannot delete admin accounts");
        }

        userRepository.delete(user);
    }

    /**
     * Approve a listing
     */
    public ListingResponse approveListing(Long id) {
        Listing listing = listingRepository. findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        listing.setAvailable(true);
        Listing saved = listingRepository.save(listing);
        return listingService.toResponse(saved);
    }

    /**
     * Reject a listing
     */
    public ListingResponse rejectListing(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));

        listing.setAvailable(false);
        Listing saved = listingRepository.save(listing);
        return listingService. toResponse(saved);
    }

    private UserResponse toUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        
        // Capitalize role
        String role = user.getRole();
        if (role != null && ! role.isEmpty()) {
            response.setRole(role.substring(0, 1).toUpperCase() + role.substring(1). toLowerCase());
        } else {
            response.setRole("Unknown");
        }
        
        response.setActive(user.getActive() != null ? user. getActive() : true);
        response. setPhone(user. getPhone());
        response.setCreatedAt(user.getCreatedAt());
        
        if (user.getCreatedAt() != null) {
            response.setJoinDate(user.getCreatedAt(). toLocalDate(). toString());
        }
        
        return response;
    }
}