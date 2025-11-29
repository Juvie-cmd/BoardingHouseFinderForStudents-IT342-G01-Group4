package com.boardinghouse.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private Long listingId;
    private Integer rating; // 1-5
    private String review;
}
