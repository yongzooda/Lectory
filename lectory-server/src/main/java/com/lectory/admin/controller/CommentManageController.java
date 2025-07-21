package com.lectory.admin.controller;

import com.lectory.admin.dto.CommentManageResponseDto;
import com.lectory.admin.service.CommentManageService;
import lombok.RequiredArgsConstructor;
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
    public List<CommentManageResponseDto> findAllComments() {
        return commentManageService.findAllComments();
    }
}
