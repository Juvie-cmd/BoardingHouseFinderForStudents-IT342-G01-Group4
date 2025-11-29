package com.boardinghouse.controller;

import com.boardinghouse.dto.*;
import com.boardinghouse.entity.*;
import com.boardinghouse.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StudentController {

    private final ListingService listingService;
    private final GeocodingService geocodingService;
    private final InquiryService inquiryService;
    private final FavoriteService favoriteService;
    private final RatingService ratingService;

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

    // ⭐ Increment view count for a listing
    @PostMapping("/listing/{id}/view")
    public ResponseEntity<Map<String, Object>> incrementViewCount(@PathVariable Long id) {
        Listing listing = listingService.incrementViewCount(id);
        Map<String, Object> response = new HashMap<>();
        response.put("viewCount", listing.getViewCount());
        return ResponseEntity.ok(response);
    }

    // =====================
    // FAVORITES ENDPOINTS
    // =====================

    // ⭐ Add a listing to favorites
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/favorite")
    public ResponseEntity<FavoriteResponse> addFavorite(
            @RequestBody FavoriteRequest request,
            Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        Favorite favorite = favoriteService.addFavorite(request.getListingId(), student);
        return ResponseEntity.ok(favoriteService.toResponse(favorite));
    }

    // ⭐ Remove a listing from favorites
    @PreAuthorize("hasRole('STUDENT')")
    @DeleteMapping("/favorite/{listingId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long listingId,
            Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        favoriteService.removeFavorite(listingId, student);
        return ResponseEntity.ok().build();
    }

    // ⭐ Get all favorites for the current student
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/favorites")
    public ResponseEntity<List<FavoriteResponse>> getFavorites(Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        List<Favorite> favorites = favoriteService.getFavoritesByUser(student.getId());
        return ResponseEntity.ok(favoriteService.toResponseList(favorites));
    }

    // ⭐ Check if a listing is favorited
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/favorite/{listingId}")
    public ResponseEntity<Map<String, Boolean>> isFavorite(
            @PathVariable Long listingId,
            Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        boolean isFavorite = favoriteService.isFavorite(student.getId(), listingId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFavorite", isFavorite);
        return ResponseEntity.ok(response);
    }

    // =====================
    // RATING ENDPOINTS
    // =====================

    // ⭐ Create or update a rating
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/rating")
    public ResponseEntity<RatingResponse> createOrUpdateRating(
            @RequestBody RatingRequest request,
            Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        Rating rating = ratingService.createOrUpdateRating(request, student);
        return ResponseEntity.ok(ratingService.toResponse(rating));
    }

    // ⭐ Get student's rating for a specific listing
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/rating/{listingId}")
    public ResponseEntity<RatingResponse> getMyRating(
            @PathVariable Long listingId,
            Authentication authentication) {
        User student = (User) authentication.getPrincipal();
        Rating rating = ratingService.getRatingByUserAndListing(student.getId(), listingId);
        if (rating == null) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(ratingService.toResponse(rating));
    }

    // ⭐ Get all ratings for a listing
    @GetMapping("/listing/{listingId}/ratings")
    public ResponseEntity<List<RatingResponse>> getListingRatings(@PathVariable Long listingId) {
        List<Rating> ratings = ratingService.getRatingsByListing(listingId);
        return ResponseEntity.ok(ratingService.toResponseList(ratings));
    }
}
