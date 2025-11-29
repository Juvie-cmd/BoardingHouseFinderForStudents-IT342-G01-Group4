package com.boardinghouse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "inquiries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Inquiry {

    public enum InquiryType {
        MESSAGE,
        VISIT_REQUEST
    }

    public enum InquiryStatus {
        NEW,
        REPLIED,
        SCHEDULED,
        CLOSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private InquiryType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @Builder.Default
    private InquiryStatus status = InquiryStatus.NEW;

    @Column(columnDefinition = "TEXT")
    private String message;

    // For visit requests
    private LocalDate visitDate;
    private LocalTime visitTime;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Landlord reply
    @Column(columnDefinition = "TEXT")
    private String reply;

    private LocalDateTime repliedAt;

    // Student who sent the inquiry
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"password", "listings", "hibernateLazyInitializer", "handler"})
    private User student;

    // Listing the inquiry is about
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Listing listing;

    // Landlord who owns the listing (denormalized for easier queries)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    @JsonIgnoreProperties({"password", "listings", "hibernateLazyInitializer", "handler"})
    private User landlord;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
