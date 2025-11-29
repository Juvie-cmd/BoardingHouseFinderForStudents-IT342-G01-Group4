package com.boardinghouse.service;

import com.boardinghouse.dto.ListingRequest;
import com.boardinghouse.dto.ListingResponse;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.entity.User;
import com.boardinghouse.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;

    public List<Listing> getAll() {
        return listingRepository.findAll();
    }

    public List<Listing> getApproved() {
        return listingRepository.findByStatus(Listing.ListingStatus.APPROVED);
    }

    public Listing getById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    public List<Listing> search(String q) {
        if (q == null || q.isBlank()) return getApproved();
        return listingRepository.findByStatusAndLocationContainingIgnoreCase(Listing.ListingStatus.APPROVED, q);
    }

    public Listing create(ListingRequest req, User landlord) {
        System.out.println("Creating listing for landlord ID: " + landlord.getId());

        // Convert imageList to comma-separated string for storage
        // Note: URLs from Supabase Storage don't contain commas, so comma is safe as delimiter
        String imageListStr = req.getImageList() != null && !req.getImageList().isEmpty()
                ? String.join(",", req.getImageList())
                : "";

        Listing listing = Listing.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .image(req.getImage())
                .imageList(imageListStr)
                .location(req.getLocation())
                .nearbySchools(req.getNearbySchools())
                .distance(req.getDistance())
                .roomType(req.getRoomType())
                .rating(req.getRating() != null ? req.getRating() : 0.0)
                .reviews(req.getReviews() != null ? req.getReviews() : 0)
                .price(req.getPrice())
                .available(req.getAvailable() != null ? req.getAvailable() : true)
                .amenities(req.getAmenities() != null ? String.join(",", req.getAmenities()) : "")
                .website(req.getWebsite())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .landlord(landlord)
                .status(Listing.ListingStatus.PENDING) // New listings start as PENDING
                .build();

        Listing saved = listingRepository.save(listing);
        System.out.println("Listing saved with ID: " + saved.getId());
        return saved;
    }

    public Listing update(Long id, ListingRequest req) {
        Listing existing = getById(id);

        existing.setTitle(req.getTitle());
        existing.setDescription(req.getDescription());
        existing.setImage(req.getImage());
        
        // Update imageList if provided
        if (req.getImageList() != null) {
            existing.setImageList(String.join(",", req.getImageList()));
        }
        
        existing.setLocation(req.getLocation());
        existing.setNearbySchools(req.getNearbySchools());
        existing.setDistance(req.getDistance());
        existing.setRoomType(req.getRoomType());
        existing.setRating(req.getRating() != null ? req.getRating() : existing.getRating());
        existing.setReviews(req.getReviews() != null ? req.getReviews() : existing.getReviews());
        existing.setPrice(req.getPrice());
        existing.setAvailable(req.getAvailable() != null ? req.getAvailable() : existing.getAvailable());
        existing.setAmenities(req.getAmenities() != null ? String.join(",", req.getAmenities()) : existing.getAmenities());
        existing.setWebsite(req.getWebsite());
        existing.setLatitude(req.getLatitude());
        existing.setLongitude(req.getLongitude());
        
        // When landlord updates a rejected listing, reset to PENDING for re-review
        if (existing.getStatus() == Listing.ListingStatus.REJECTED) {
            existing.setStatus(Listing.ListingStatus.PENDING);
            existing.setRejectionNotes(null);
        }

        return listingRepository.save(existing);
    }

    public void delete(Long id) {
        listingRepository.deleteById(id);
    }

    public List<Listing> getByLandlord(Long landlordId) {
        System.out.println("Searching listings for landlord ID: " + landlordId);
        List<Listing> listings = listingRepository.findByLandlord_Id(landlordId);
        System.out.println("Found " + listings.size() + " listings");
        return listings;
    }

    public Listing incrementViewCount(Long id) {
        Listing listing = getById(id);
        Integer currentViews = listing.getViewCount() != null ? listing.getViewCount() : 0;
        listing.setViewCount(currentViews + 1);
        return listingRepository.save(listing);
    }

    public Integer getTotalViewsByLandlord(Long landlordId) {
        List<Listing> listings = getByLandlord(landlordId);
        return listings.stream()
                .mapToInt(l -> l.getViewCount() != null ? l.getViewCount() : 0)
                .sum();
    }

    /* ---------------------
       DTO / Mapper helpers
       --------------------- */

    public ListingResponse toResponse(Listing l) {
        if (l == null) return null;
        ListingResponse r = new ListingResponse();
        r.setId(l.getId());
        r.setTitle(l.getTitle());
        r.setDescription(l.getDescription());
        r.setImage(l.getImage());
        
        // Parse imageList from comma-separated string
        if (l.getImageList() != null && !l.getImageList().isBlank()) {
            List<String> images = Arrays.stream(l.getImageList().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            r.setImageList(images);
        } else {
            r.setImageList(List.of());
        }
        
        r.setLocation(l.getLocation());
        r.setPrice(l.getPrice());
        r.setRoomType(l.getRoomType());
        r.setRating(l.getRating());
        r.setReviews(l.getReviews());
        r.setAvailable(l.getAvailable());
        r.setLatitude(l.getLatitude());
        r.setLongitude(l.getLongitude());
        r.setNearbySchools(l.getNearbySchools());
        r.setDistance(l.getDistance());
        r.setWebsite(l.getWebsite());
        r.setStatus(l.getStatus() != null ? l.getStatus().name() : "PENDING");
        r.setRejectionNotes(l.getRejectionNotes());
        r.setViewCount(l.getViewCount() != null ? l.getViewCount() : 0);

        if (l.getAmenities() != null && !l.getAmenities().isBlank()) {
            List<String> am = Arrays.stream(l.getAmenities().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            r.setAmenities(am);
        } else {
            r.setAmenities(List.of());
        }
        
        // Add landlord info
        if (l.getLandlord() != null) {
            ListingResponse.LandlordInfo landlordInfo = new ListingResponse.LandlordInfo();
            landlordInfo.setId(l.getLandlord().getId());
            landlordInfo.setName(l.getLandlord().getName());
            landlordInfo.setEmail(l.getLandlord().getEmail());
            landlordInfo.setPhone(l.getLandlord().getPhone());
            r.setLandlord(landlordInfo);
        }

        return r;
    }

    public List<ListingResponse> toResponseList(List<Listing> listings) {
        return listings.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
