package com.boardinghouse.repository;

import com.boardinghouse.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    Optional<Rating> findByUser_IdAndListing_Id(Long userId, Long listingId);
    
    List<Rating> findByListing_IdOrderByCreatedAtDesc(Long listingId);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.listing.id = :listingId")
    Double getAverageRatingByListingId(@Param("listingId") Long listingId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.listing.id = :listingId")
    Integer getReviewCountByListingId(@Param("listingId") Long listingId);
    
    boolean existsByUser_IdAndListing_Id(Long userId, Long listingId);
}
