package com.boardinghouse.dto;

import lombok.Data;

@Data
public class RatingResponse {
    private Long id;
    private Integer rating;
    private String review;
    private String createdAt;
    private String updatedAt;
    private UserInfo user;

    @Data
    public static class UserInfo {
        private Long id;
        private String name;
    }
}
