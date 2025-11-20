package com.boardinghouse.service;

import com.boardinghouse.entity.Listing;
import com.boardinghouse.entity.User;
import com.boardinghouse.dto.ListingRequest;
import com.boardinghouse.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;

    public List<Listing> getAll() {
        return listingRepository.findAll();
    }

    public Listing getById(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    public List<Listing> search(String q) {
        if (q == null || q.isBlank()) return getAll();
        return listingRepository.findByLocationContainingIgnoreCase(q);
    }

    public Listing create(ListingRequest req, User landlord) {
        Listing listing = Listing.builder()
                .title(req.getTitle())
                .image(req.getImage())
                .location(req.getLocation())
                .nearbySchools(req.getNearbySchools())
                .distance(req.getDistance())
                .roomType(req.getRoomType())
                .rating(req.getRating())
                .reviews(req.getReviews())
                .price(req.getPrice())
                .available(true)
                .amenities(String.join(",", req.getAmenities()))
                .website(req.getWebsite())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .landlord(landlord)
                .build();

        return listingRepository.save(listing);
    }

    public Listing update(Long id, ListingRequest req) {
        Listing existing = getById(id);

        existing.setTitle(req.getTitle());
        existing.setImage(req.getImage());
        existing.setLocation(req.getLocation());
        existing.setNearbySchools(req.getNearbySchools());
        existing.setDistance(req.getDistance());
        existing.setRoomType(req.getRoomType());
        existing.setRating(req.getRating());
        existing.setReviews(req.getReviews());
        existing.setPrice(req.getPrice());
        existing.setAvailable(true); // or existing.getAvailable() if you want to preserve current value
        existing.setAmenities(String.join(",", req.getAmenities()));
        existing.setWebsite(req.getWebsite());
        existing.setLatitude(req.getLatitude());
        existing.setLongitude(req.getLongitude());

        return listingRepository.save(existing);
    }

    public void delete(Long id) {
        listingRepository.deleteById(id);
    }

    public List<Listing> getByLandlord(Long landlordId) {
        return listingRepository.findByLandlord_Id(landlordId);
    }
}
