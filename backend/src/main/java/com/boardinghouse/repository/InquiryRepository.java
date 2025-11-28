package com.boardinghouse.repository;

import com.boardinghouse.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByLandlord_IdOrderByCreatedAtDesc(Long landlordId);
    List<Inquiry> findByStudent_IdOrderByCreatedAtDesc(Long studentId);
    List<Inquiry> findByListing_IdOrderByCreatedAtDesc(Long listingId);
}
