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

}
