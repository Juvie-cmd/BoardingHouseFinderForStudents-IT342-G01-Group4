package com.boardinghouse.dto;

import lombok.Data;

@Data
public class InquiryRequest {
    private Long listingId;
    private String type; // MESSAGE or VISIT_REQUEST
    private String message;
    private String visitDate; // ISO date format (yyyy-MM-dd)
    private String visitTime; // ISO time format (HH:mm)
    private String notes;
}
