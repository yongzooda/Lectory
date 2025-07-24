package com.lectory.admin.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertResponseDto {
    private Long userId;
    private String email;
    private String nickname;
    private String createdAt;
    private String approvalStatus;         // PENDING / APPROVED / REJECTED
    private String portfolioFileUrl;       // 포트폴리오 URL
}
