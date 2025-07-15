// ===== CommentRequest.java =====
package com.lectory.contentlibrary.dto;

import lombok.*;

/**
 * 후기 댓글 등록 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDto {
    /** 댓글 작성자 회원 ID */
    private Long memberId;
    /** 댓글 내용 */
    private String content;
}