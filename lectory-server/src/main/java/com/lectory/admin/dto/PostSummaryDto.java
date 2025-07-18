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
    private boolean isReported;
}