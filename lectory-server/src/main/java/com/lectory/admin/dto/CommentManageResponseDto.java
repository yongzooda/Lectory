package com.lectory.admin.dto;

import com.lectory.common.domain.user.UserType;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentManageResponseDto {
    private Long commentId;
    private Long postId;
    private String postTitle;
    private Long userId;
    private String nickname;
    private UserType userType;
    private String content;
    private boolean isResolved;
    private int likeCount;
    private LocalDateTime createdAt;
    private boolean isAccepted;
    private boolean isReported;
}
