package com.lectory.admin.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostSummaryDto {
    private Long postId;
    private String title;
    private String authorEmail;
    private String createdAt;
    // 계산 필드
    private boolean reported;
}