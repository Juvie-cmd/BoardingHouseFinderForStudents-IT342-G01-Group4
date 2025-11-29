package com.boardinghouse.service;

import com.boardinghouse.dto.InquiryRequest;
import com.boardinghouse.dto.InquiryResponse;
import com.boardinghouse.entity.Inquiry;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.entity.User;
import com.boardinghouse.repository.InquiryRepository;
import com.boardinghouse.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final ListingRepository listingRepository;

    public Inquiry createInquiry(InquiryRequest request, User student) {
        Listing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        User landlord = listing.getLandlord();
        if (landlord == null) {
            throw new RuntimeException("Listing has no landlord");
        }

        Inquiry.InquiryType type = Inquiry.InquiryType.valueOf(request.getType().toUpperCase());

        Inquiry inquiry = Inquiry.builder()
                .type(type)
                .status(Inquiry.InquiryStatus.NEW)
                .message(request.getMessage())
                .notes(request.getNotes())
                .student(student)
                .listing(listing)
                .landlord(landlord)
                .build();

        if (type == Inquiry.InquiryType.VISIT_REQUEST) {
            if (request.getVisitDate() != null && !request.getVisitDate().isEmpty()) {
                inquiry.setVisitDate(LocalDate.parse(request.getVisitDate()));
            }
            if (request.getVisitTime() != null && !request.getVisitTime().isEmpty()) {
                inquiry.setVisitTime(LocalTime.parse(request.getVisitTime()));
            }
        }

        return inquiryRepository.save(inquiry);
    }

    public List<Inquiry> getInquiriesByLandlord(Long landlordId) {
        return inquiryRepository.findByLandlord_IdOrderByCreatedAtDesc(landlordId);
    }

    public List<Inquiry> getInquiriesByStudent(Long studentId) {
        return inquiryRepository.findByStudent_IdOrderByCreatedAtDesc(studentId);
    }

    public Inquiry updateInquiryStatus(Long inquiryId, Inquiry.InquiryStatus status) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("Inquiry not found"));
        inquiry.setStatus(status);
        return inquiryRepository.save(inquiry);
    }

    public Inquiry replyToInquiry(Long inquiryId, String reply) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("Inquiry not found"));
        inquiry.setReply(reply);
        inquiry.setRepliedAt(java.time.LocalDateTime.now());
        inquiry.setStatus(Inquiry.InquiryStatus.REPLIED);
        return inquiryRepository.save(inquiry);
    }

    public InquiryResponse toResponse(Inquiry inquiry) {
        InquiryResponse response = new InquiryResponse();
        response.setId(inquiry.getId());
        response.setType(inquiry.getType().name());
        response.setStatus(inquiry.getStatus().name());
        response.setMessage(inquiry.getMessage());
        response.setNotes(inquiry.getNotes());
        
        if (inquiry.getVisitDate() != null) {
            response.setVisitDate(inquiry.getVisitDate().toString());
        }
        if (inquiry.getVisitTime() != null) {
            response.setVisitTime(inquiry.getVisitTime().format(DateTimeFormatter.ofPattern("HH:mm")));
        }
        if (inquiry.getCreatedAt() != null) {
            String createdAtStr = inquiry.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            response.setCreatedAt(createdAtStr);
            response.setDateSent(createdAtStr);
        }

        // Student info
        if (inquiry.getStudent() != null) {
            InquiryResponse.StudentInfo studentInfo = new InquiryResponse.StudentInfo();
            studentInfo.setId(inquiry.getStudent().getId());
            studentInfo.setName(inquiry.getStudent().getName());
            studentInfo.setEmail(inquiry.getStudent().getEmail());
            response.setStudent(studentInfo);
        }

        // Listing info
        if (inquiry.getListing() != null) {
            InquiryResponse.ListingInfo listingInfo = new InquiryResponse.ListingInfo();
            listingInfo.setId(inquiry.getListing().getId());
            listingInfo.setTitle(inquiry.getListing().getTitle());
            listingInfo.setLocation(inquiry.getListing().getLocation());
            response.setListing(listingInfo);
        }

        // Reply info
        response.setReply(inquiry.getReply());
        if (inquiry.getRepliedAt() != null) {
            response.setRepliedAt(inquiry.getRepliedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }

        return response;
    }

    public List<InquiryResponse> toResponseList(List<Inquiry> inquiries) {
        return inquiries.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
