package com.boardinghouse.controller;

import com.boardinghouse.dto.InquiryRequest;
import com.boardinghouse.dto.InquiryResponse;
import com.boardinghouse.dto.ListingResponse;
import com.boardinghouse.entity.Inquiry;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.entity.User;
import com.boardinghouse.service.GeocodingService;
import com.boardinghouse.service.InquiryService;
import com.boardinghouse.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StudentController {

    private final ListingService listingService;
    private final GeocodingService geocodingService;
    private final InquiryService inquiryService;

    // ⭐ Get all approved listings (with optional search and distance filtering)
    @GetMapping("/listings")
    public List<ListingResponse> getListings(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Double radiusKm) {
        
        // search() now returns only APPROVED listings
        List<Listing> found = listingService.search(q);
        
        // If location and radius are provided, filter by distance
        if (lat != null && lon != null && radiusKm != null) {
            found = found.stream()
                .filter(listing -> {
                    if (listing.getLatitude() == null || listing.getLongitude() == null) {
                        return false;
                    }
                    double distance = geocodingService.calculateDistance(
                        lat, lon,
                        listing.getLatitude(), listing.getLongitude()
                    );
                    return distance <= radiusKm;
                })
                .collect(Collectors.toList());
        }
        
        return listingService.toResponseList(found);
    }

    // ⭐ Get single listing details (only approved listings visible to students)
    @GetMapping("/listing/{id}")
    public ListingResponse getListing(@PathVariable Long id) {
        Listing listing = listingService.getById(id);
        
        // Only show approved listings to students
        if (listing.getStatus() != Listing.ListingStatus.APPROVED) {
            throw new RuntimeException("Listing not available");
        }
        
        return listingService.toResponse(listing);
    }
    
    // ⭐ Send a message or request a visit to a landlord
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/inquiry")
    public ResponseEntity<InquiryResponse> createInquiry(
            @RequestBody InquiryRequest request,
            Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        
        Inquiry inquiry = inquiryService.createInquiry(request, student);
        return ResponseEntity.ok(inquiryService.toResponse(inquiry));
    }
    
    // ⭐ Get student's own inquiries
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/inquiries")
    public ResponseEntity<List<InquiryResponse>> getMyInquiries(Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        List<Inquiry> inquiries = inquiryService.getInquiriesByStudent(student.getId());
        return ResponseEntity.ok(inquiryService.toResponseList(inquiries));
    }
}
