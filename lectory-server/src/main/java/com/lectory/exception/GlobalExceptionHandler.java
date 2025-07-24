package com.lectory.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException ex) {
        log.warn("🔥 CustomException 발생: [{}] {}", ex.getErrorCode().getErrorCode(), ex.getErrorCode().getMessage());
        CustomErrorCode errorCode = ex.getErrorCode();
        ErrorResponse errorResponse = new ErrorResponse(errorCode.getErrorCode(), errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatus()).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
//        List<FieldError> errors = ex.getBindingResult().getFieldErrors();
//        List<Map<String, String>> bodyError = new ArrayList<>();
//        for(FieldError error : errors) {
//            bodyError.add(Map.of("field", error.getField(), "message", error.getDefaultMessage()));
//        }
//
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
//                "status", HttpStatus.BAD_REQUEST.value(),
//                "message", "유효성 검사 실패",
//                "errors", bodyError
//        ));
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.badRequest().body(errorMessage);

    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    // 관리자 권한이 아니면 403 -> 관리자 전용"이라는 메시지 표현
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("관리자만 사용할 수 있는 기능입니다.");
    }
}
