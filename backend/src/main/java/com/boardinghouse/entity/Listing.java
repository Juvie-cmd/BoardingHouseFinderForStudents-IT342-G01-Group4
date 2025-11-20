package com.boardinghouse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // BASIC INFO
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description; // <-- ensure this exists to match ListingRequest

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    private String location;

    @Column(columnDefinition = "TEXT")
    private String nearbySchools;

    private String distance;

    private String roomType;

    private Double rating;

    private Integer reviews;

    private Double price;

    private Boolean available = true;

    // Amenities array stored as comma-separated string
    @Column(columnDefinition = "TEXT")
    private String amenities;

    private String website;

    // Coordinates
    private Double latitude;
    private Double longitude;

    // Landlord user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id")
    @JsonIgnoreProperties({"password", "listings", "hibernateLazyInitializer", "handler"})
    private User landlord;
}