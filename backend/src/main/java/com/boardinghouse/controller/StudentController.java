package com.boardinghouse.controller;

import com.boardinghouse.dto.ListingResponse;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StudentController {

    private final ListingService listingService;

    // ⭐ Get all listings (with optional search)
    @GetMapping("/listings")
    public List<ListingResponse> getListings(@RequestParam(required = false) String q) {
        List<Listing> found = listingService.search(q);
        return listingService.toResponseList(found);
    }

    // ⭐ Get single listing details
    @GetMapping("/listing/{id}")
    public ListingResponse getListing(@PathVariable Long id) {
        Listing listing = listingService.getById(id);
        return listingService.toResponse(listing);
    }
}
