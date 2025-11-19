package com.boardinghouse.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuth2UserInfo {
    private String id;
    private String email;
    private String name;
    private String picture;
    private Boolean emailVerified;
}