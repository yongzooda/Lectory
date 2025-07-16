package com.lectory.comment.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponseDto {
    private Long comment_id;
    private Long post_id;
    private Long user_id;
    private Long parent_id;
    private String content;
    private Integer like_count;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private Boolean is_accepted;
    private Boolean is_deleted;
}
