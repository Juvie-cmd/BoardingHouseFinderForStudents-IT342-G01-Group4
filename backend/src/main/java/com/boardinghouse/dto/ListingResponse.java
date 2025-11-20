package com.boardinghouse.dto;

import lombok.Data;

import java.util.List;

@Data
public class ListingResponse {
    private Long id;
    private String title;
    private String description;
    private String image;
    private List<String> imageList;
    private String location;
    private Double price;
    private String roomType;
    private Double rating;
    private Integer reviews;
    private Boolean available;
    private List<String> amenities;
    private Double latitude;
    private Double longitude;
    private String nearbySchools;
    private String distance;
    private String website;
}
