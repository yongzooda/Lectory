// CommentDto.java
package com.lectory.contentlibrary.dto;

/**
 * 강의실 상세 조회 및 댓글 작성 후 응답에 사용되는 댓글 정보 DTO
 */
public record CommentDto(
        Long commentId,
        String author,
        String content,
        String createdAt  // ISO-8601 형식의 timestamp
) {}
