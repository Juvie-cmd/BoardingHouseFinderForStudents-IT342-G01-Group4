package com.boardinghouse.controller;

import com.boardinghouse.dto.ListingRequest;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.entity.User;
import com.boardinghouse.repository.UserRepository;
import com.boardinghouse.service.ListingService;
import com.boardinghouse.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/landlord")
@RequiredArgsConstructor
public class LandlordController {

    private final ListingService listingService;
    private final UserRepository userRepository;
    private final UserService userService;

    @PreAuthorize("hasRole('LANDLORD')")
    @PostMapping("/listing")
    public Listing createListing(@RequestBody ListingRequest request) {

        User landlord = userService.getCurrentUser();

        if (!"landlord".equalsIgnoreCase(landlord.getRole())) {
            throw new RuntimeException("Only landlords can create listings");
        }

        return listingService.create(request, landlord);
    }

    @GetMapping("/listings")
    public List<Listing> getMyListings() {
        User landlord = userService.getCurrentUser();
        System.out.println("LOGGED-IN LANDLORD ID = " + landlord.getId());
        return listingService.getByLandlord(landlord.getId());
    }

    @PutMapping("/listing/{id}")
    public Listing updateListing(@PathVariable Long id, @RequestBody ListingRequest request) {
        User landlord = userService.getCurrentUser();
        return listingService.update(id, request);
    }

    @DeleteMapping("/listing/{id}")
    public void deleteListing(@PathVariable Long id) {
        listingService.delete(id);
    }
}
