package com.boardinghouse.service;

import com.boardinghouse.dto.RatingRequest;
import com.boardinghouse.dto.RatingResponse;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.entity.Rating;
import com.boardinghouse.entity.User;
import com.boardinghouse.repository.ListingRepository;
import com.boardinghouse.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ListingRepository listingRepository;

    @Transactional
    public Rating createOrUpdateRating(RatingRequest request, User user) {
        Listing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Validate rating value
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Optional<Rating> existingRating = ratingRepository.findByUser_IdAndListing_Id(user.getId(), request.getListingId());

        Rating rating;
        if (existingRating.isPresent()) {
            // Update existing rating
            rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setReview(request.getReview());
        } else {
            // Create new rating
            rating = Rating.builder()
                    .user(user)
                    .listing(listing)
                    .rating(request.getRating())
                    .review(request.getReview())
                    .build();
        }

        Rating savedRating = ratingRepository.save(rating);

        // Update listing's average rating and review count
        updateListingRatingStats(listing.getId());

        return savedRating;
    }

    public Rating getRatingByUserAndListing(Long userId, Long listingId) {
        return ratingRepository.findByUser_IdAndListing_Id(userId, listingId).orElse(null);
    }

    public List<Rating> getRatingsByListing(Long listingId) {
        return ratingRepository.findByListing_IdOrderByCreatedAtDesc(listingId);
    }

    public Double getAverageRating(Long listingId) {
        Double avg = ratingRepository.getAverageRatingByListingId(listingId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public Integer getReviewCount(Long listingId) {
        Integer count = ratingRepository.getReviewCountByListingId(listingId);
        return count != null ? count : 0;
    }

    @Transactional
    public void updateListingRatingStats(Long listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        Double avgRating = getAverageRating(listingId);
        Integer reviewCount = getReviewCount(listingId);

        listing.setRating(avgRating);
        listing.setReviews(reviewCount);
        listingRepository.save(listing);
    }

    public RatingResponse toResponse(Rating rating) {
        RatingResponse response = new RatingResponse();
        response.setId(rating.getId());
        response.setRating(rating.getRating());
        response.setReview(rating.getReview());
        response.setCreatedAt(rating.getCreatedAt() != null ? rating.getCreatedAt().toString() : null);
        response.setUpdatedAt(rating.getUpdatedAt() != null ? rating.getUpdatedAt().toString() : null);

        if (rating.getUser() != null) {
            RatingResponse.UserInfo userInfo = new RatingResponse.UserInfo();
            userInfo.setId(rating.getUser().getId());
            userInfo.setName(rating.getUser().getName());
            response.setUser(userInfo);
        }

        return response;
    }

    public List<RatingResponse> toResponseList(List<Rating> ratings) {
        return ratings.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
