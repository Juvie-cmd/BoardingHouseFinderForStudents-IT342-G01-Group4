package com.boardinghouse.repository;

import com.boardinghouse.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByLocationContainingIgnoreCase(String location);
    List<Listing> findByLandlord_Id(Long landlordId);
}
