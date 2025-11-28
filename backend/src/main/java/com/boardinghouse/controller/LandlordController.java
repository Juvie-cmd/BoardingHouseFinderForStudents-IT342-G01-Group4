package com.boardinghouse.controller;

import com.boardinghouse.dto.InquiryResponse;
import com.boardinghouse.dto.ListingRequest;
import com.boardinghouse.dto.ListingResponse;
import com.boardinghouse.entity.Inquiry;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.entity.User;
import com.boardinghouse.service.InquiryService;
import com.boardinghouse.service.ListingService;
import com.boardinghouse.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/landlord")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class LandlordController {

    private final ListingService listingService;
    private final UserService userService;
    private final InquiryService inquiryService;

    @PreAuthorize("hasRole('LANDLORD')")
    @PostMapping("/listing")
    public ListingResponse createListing(@RequestBody ListingRequest request, Authentication authentication) {
        User landlord = (User) authentication.getPrincipal();

        if (!"landlord".equalsIgnoreCase(landlord.getRole())) {
            throw new RuntimeException("Only landlords can create listings");
        }

        Listing saved = listingService.create(request, landlord);
        return listingService.toResponse(saved);
    }

    @GetMapping("/listings")
    public List<ListingResponse> getMyListings(Authentication authentication) {
        User landlord = (User) authentication.getPrincipal();
        System.out.println("LOGGED-IN LANDLORD ID = " + landlord.getId());
        System.out.println("LOGGED-IN LANDLORD EMAIL = " + landlord.getEmail());

        List<Listing> listings = listingService.getByLandlord(landlord.getId());
        System.out.println("FOUND " + listings.size() + " LISTINGS");

        return listingService.toResponseList(listings);
    }

    @PutMapping("/listing/{id}")
    public ListingResponse updateListing(@PathVariable Long id, @RequestBody ListingRequest request, Authentication authentication) {
        // Authorization: ensure the authenticated landlord owns the listing (optional extra check)
        Listing updated = listingService.update(id, request);
        return listingService.toResponse(updated);
    }

    @DeleteMapping("/listing/{id}")
    public void deleteListing(@PathVariable Long id) {
        listingService.delete(id);
    }
    
    // ⭐ Get all inquiries for the landlord's listings
    @PreAuthorize("hasRole('LANDLORD')")
    @GetMapping("/inquiries")
    public ResponseEntity<List<InquiryResponse>> getInquiries(Authentication authentication) {
        User landlord = (User) authentication.getPrincipal();
        List<Inquiry> inquiries = inquiryService.getInquiriesByLandlord(landlord.getId());
        return ResponseEntity.ok(inquiryService.toResponseList(inquiries));
    }
    
    // ⭐ Update inquiry status (mark as replied, scheduled, etc.)
    @PreAuthorize("hasRole('LANDLORD')")
    @PutMapping("/inquiry/{id}/status")
    public ResponseEntity<InquiryResponse> updateInquiryStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        Inquiry.InquiryStatus newStatus = Inquiry.InquiryStatus.valueOf(status.toUpperCase());
        Inquiry updated = inquiryService.updateInquiryStatus(id, newStatus);
        return ResponseEntity.ok(inquiryService.toResponse(updated));
    }
}
