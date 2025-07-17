package com.lectory.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomErrorCode {
    // 회원 M
    MEMBER_NOT_EXIST(HttpStatus.BAD_REQUEST, "M001", "존재하지 않는 회원입니다."),

    // 게시글 P
    POST_NOT_FOUND(HttpStatus.BAD_REQUEST, "P001", "요청하신 게시글을 찾을 수 없습니다."),

    // 댓글 C
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "C001", "요청하신 댓글을 찾을 수 없습니다."),
    COMMENT_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "C002", "댓글을 수정할 권한이 없습니다."),
    COMMENT_ALREADY_ACCEPTED(HttpStatus.CONFLICT, "C003", "이미 채택된 댓글이 있습니다.");

    private final HttpStatus status;
    private final String errorCode;
    private final String message;
}
