package com.lectory.comment.controller;

import com.lectory.comment.dto.CommentRequestDto;
import com.lectory.comment.dto.CommentResponseDto;
import com.lectory.comment.service.CommentServiceImpl;
import com.lectory.user.security.CustomUserDetail;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/post/{postId}/comment")
public class CommentController {

    private final CommentServiceImpl commentService;

    // 댓글 작성
    @PostMapping
    public ResponseEntity<CommentResponseDto> addComment(@PathVariable Long postId, @Valid @RequestBody CommentRequestDto req, @AuthenticationPrincipal CustomUserDetail userDetail) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.addComment(postId, req, userDetail));
    }

    // 대댓글 작성
    @PostMapping("/{parentId}")
    public ResponseEntity<CommentResponseDto> addReply(@PathVariable Long postId, @PathVariable Long parentId, @Valid @RequestBody CommentRequestDto req, @AuthenticationPrincipal CustomUserDetail userDetail) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.addReply(postId, parentId, req, userDetail));
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(@PathVariable Long commentId, @Valid @RequestBody CommentRequestDto req, @AuthenticationPrincipal CustomUserDetail userDetail) {
        return ResponseEntity.ok(commentService.updateComment(commentId, req, userDetail));
    }

    // 댓글삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long postId, @PathVariable Long commentId, @AuthenticationPrincipal CustomUserDetail userDetail) {
        commentService.deleteComment(postId, commentId, userDetail);
        return ResponseEntity.noContent().build();
    }

    // 댓글 조회
    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long postId) {
        List<CommentResponseDto> comments = commentService.getComments(postId);
        return ResponseEntity.ok(comments);
    }
}
