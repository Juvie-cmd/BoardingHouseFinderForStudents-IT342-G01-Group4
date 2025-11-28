package com.boardinghouse.controller;

import com.boardinghouse.dto.ListingResponse;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.service.GeocodingService;
import com.boardinghouse.service.ListingService;
import lombok.RequiredArgsConstructor;
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

    // ⭐ Get all listings (with optional search and distance filtering)
    @GetMapping("/listings")
    public List<ListingResponse> getListings(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Double radiusKm) {
        
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

    // ⭐ Get single listing details
    @GetMapping("/listing/{id}")
    public ListingResponse getListing(@PathVariable Long id) {
        Listing listing = listingService.getById(id);
        return listingService.toResponse(listing);
    }
}
