package com.lectory.admin.controller;

import com.lectory.admin.dto.CommentManageResponseDto;
import com.lectory.admin.service.CommentManageService;
import com.lectory.comment.dto.CommentRequestDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.service.RequestBodyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/manage-comments")
@RequiredArgsConstructor
public class CommentManageController {
    private final CommentManageService commentManageService;

    // 댓글 조회
    @GetMapping
    public List<CommentManageResponseDto> findAllComments() {
        return commentManageService.findAllComments();
    }
    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<Void> updateComment(@PathVariable Long commentId, @Valid @RequestBody CommentRequestDto req) {
        commentManageService.updateComment(commentId, req);
        return ResponseEntity.ok().build();
    }
    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentManageService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }
}
