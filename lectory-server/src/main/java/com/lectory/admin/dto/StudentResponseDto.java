package com.lectory.admin.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponseDto {
    private Long userId;
    private String email;
    private String nickname;
    private String createdAt;  // ISO-8601 형식의 timestamp
    private String userType;  // FREE 또는 PAID
}