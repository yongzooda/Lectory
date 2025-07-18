package com.lectory.admin.controller;

import com.lectory.admin.dto.PostSummaryDto;
import com.lectory.admin.service.PostManageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/manage-posts")
@RequiredArgsConstructor
public class PostManageController {

    private final PostManageService postManageService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    @Operation(summary = "게시글 목록 조회", description = "작성자, 생성일자, 신고 여부 포함된 게시글 리스트 반환")
    public List<PostSummaryDto> getPosts() {
        return postManageService.getAllPosts();
    }
}
