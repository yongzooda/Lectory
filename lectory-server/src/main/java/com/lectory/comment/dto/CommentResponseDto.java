package com.lectory.comment.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponseDto {
    private Long commentId;
    private Long postId;
    private Long userId;
    private Long parentId;
    private String content;
    private Integer likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isAccepted;
    private Boolean isDeleted;
    private List<CommentResponseDto> replies;
    private boolean isHidden;
}
