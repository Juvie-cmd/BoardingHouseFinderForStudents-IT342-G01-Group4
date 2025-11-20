package com.boardinghouse.dto;

import lombok.Data;

import java.util.List;

@Data
public class ListingRequest {

    private String title;
    private String description;
    private String location;

    private Double price;
    private String roomType;
    private String availableFrom;

    private Integer maxOccupancy;
    private Integer minStay;
    private Double depositAmount;
    private Boolean utilitiesIncluded;

    private List<String> amenities;

    private String image;
    private List<String> imageList;

    private Double latitude;
    private Double longitude;

    // optional fields (match your UI)
    private String nearbySchools;
    private String distance;
    private String website;

    private Double rating = 0.0;
    private Integer reviews = 0;
}
