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
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "존재하지 않는 게시글입니다."),
    POST_ONLY_EXPERT(HttpStatus.FORBIDDEN, "P002", "전문가 전용 게시글에는 무료 권한 사용자는 댓글 작성이 불가능합니다."),

    // 댓글 C
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "C001", "요청하신 댓글을 찾을 수 없습니다."),
    COMMENT_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "C002", "댓글을 수정할 권한이 없습니다."),
    COMMENT_ALREADY_ACCEPTED(HttpStatus.CONFLICT, "C003", "이미 채택된 댓글이 있습니다."),
    COMMENT_POST_MISMATCH(HttpStatus.BAD_REQUEST, "C004", "댓글이 해당 게시글에 속하지 않습니다."),
    REPORT_ALREADY_EXISTS(HttpStatus.CONFLICT, "C005", "이미 신고한 대상입니다"),
    EXPERT_CAN_COMMENT_ON_PAID_ONLY(HttpStatus.FORBIDDEN, "C006", "전문가는 유료 사용자 게시글에만 댓글을 작성할 수 있습니다.");

    private final HttpStatus status;
    private final String errorCode;
    private final String message;
}
