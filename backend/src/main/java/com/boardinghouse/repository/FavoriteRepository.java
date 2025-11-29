package com.boardinghouse.repository;

import com.boardinghouse.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    List<Favorite> findByUser_IdOrderByCreatedAtDesc(Long userId);
    
    Optional<Favorite> findByUser_IdAndListing_Id(Long userId, Long listingId);
    
    boolean existsByUser_IdAndListing_Id(Long userId, Long listingId);
    
    void deleteByUser_IdAndListing_Id(Long userId, Long listingId);
}
