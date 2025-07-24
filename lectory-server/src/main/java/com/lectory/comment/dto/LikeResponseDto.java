package com.lectory.comment.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeResponseDto {
    private Long commentId;
    private Long likeCount;
    private boolean liked;
}
