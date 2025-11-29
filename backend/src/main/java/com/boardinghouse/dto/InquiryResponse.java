package com.boardinghouse.dto;

import lombok.Data;

@Data
public class InquiryResponse {
    private Long id;
    private String type;
    private String status;
    private String message;
    private String visitDate;
    private String visitTime;
    private String notes;
    private String createdAt;
    private String dateSent; // alias for createdAt for frontend compatibility
    
    // Reply fields
    private String reply;
    private String repliedAt;
    
    // Student info
    private StudentInfo student;
    
    // Listing info
    private ListingInfo listing;
    
    @Data
    public static class StudentInfo {
        private Long id;
        private String name;
        private String email;
    }
    
    @Data
    public static class ListingInfo {
        private Long id;
        private String title;
        private String location;
    }
}
