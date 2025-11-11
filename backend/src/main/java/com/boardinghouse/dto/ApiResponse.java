package com.boardinghouse.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;

    public static ApiResponse success(String message, Object data) {
        return ApiResponse.builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static ApiResponse success(String message) {
        return success(message, null);
    }

    public static ApiResponse error(String message) {
        return ApiResponse.builder()
                .success(false)
                .message(message)
                .data(null)
                .build();
    }
}
