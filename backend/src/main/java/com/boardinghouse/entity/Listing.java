package com.boardinghouse.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // BASIC INFO
    private String title;

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
    private User landlord;
}
