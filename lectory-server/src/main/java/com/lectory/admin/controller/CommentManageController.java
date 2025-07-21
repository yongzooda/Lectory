package com.lectory.admin.controller;

import com.lectory.admin.dto.CommentManageResponseDto;
import com.lectory.admin.service.CommentManageService;
import com.lectory.user.security.CustomUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/manage-comments")
@RequiredArgsConstructor
public class CommentManageController {
    private final CommentManageService commentManageService;

    @GetMapping
    public ResponseEntity<?> findAllComments(@AuthenticationPrincipal CustomUserDetail userDetails) {
        if (userDetails == null || !userDetails.getUser().getUserType().getUserType().equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("관리자 권한이 필요합니다.");
        }
        List<CommentManageResponseDto> commentManageResponseDtos = commentManageService.findAllComments();
        return ResponseEntity.ok(commentManageResponseDtos);
    }
}
