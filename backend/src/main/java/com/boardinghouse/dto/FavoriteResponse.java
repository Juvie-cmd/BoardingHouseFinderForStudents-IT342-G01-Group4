package com.boardinghouse.dto;

import lombok.Data;

@Data
public class FavoriteResponse {
    private Long id;
    private Long listingId;
    private String listingTitle;
    private String listingImage;
    private String listingLocation;
    private Double listingPrice;
    private String createdAt;
}
