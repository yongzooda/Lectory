// ===== CommentResponse.java =====
package com.lectory.contentlibrary.dto;

import lombok.*;

/**
 * 후기 댓글 등록 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponseDto {
    /** 생성된 댓글 ID */
    private Long commentId;
    /** 댓글 작성자 닉네임 or ID */
    private String author;
    /** 댓글 내용 */
    private String content;
    /** 생성 일시 (ISO-8601) */
    private String createdAt;
    /** 처리 성공 여부 */
    private boolean success;
}