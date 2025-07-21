package com.lectory.post.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.lectory.post.dto.PostRequestDto;
import com.lectory.post.dto.PostResponseDto;
import com.lectory.post.service.PostService;
import com.lectory.user.security.CustomUserDetail;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 글 등록
    @PostMapping
    public ResponseEntity<PostResponseDto> write(
            @Valid @RequestBody PostRequestDto dto,
            @AuthenticationPrincipal CustomUserDetail principal
    ) {
        Long userId = principal.getUser().getUserId();  // 또는 principal.getId()
        PostResponseDto response = postService.write(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDto> rewrite(
            @PathVariable Long postId,
            @Valid @RequestBody PostRequestDto dto,
            @AuthenticationPrincipal CustomUserDetail principal
    ) {
        Long userId = principal.getUser().getUserId();
        PostResponseDto response = postService.rewrite(postId, dto, userId);
        return ResponseEntity.ok(response);
    }

    // 글 상세 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> pick(
            @PathVariable Long postId
    ) {
        PostResponseDto response = postService.pick(postId);
        return ResponseEntity.ok(response);
    }

    // 글 목록 조회 (페이징 처리)
    @GetMapping
    public ResponseEntity<Page<PostResponseDto>> view(
            @AuthenticationPrincipal CustomUserDetail principal,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        Long userId = principal.getUser().getUserId();
        Page<PostResponseDto> page = postService.view(userId, pageable);
        return ResponseEntity.ok(page);
    }

    // 글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetail principal
    ) {
        Long userId = principal.getUser().getUserId();
        postService.delete(postId, userId);
        return ResponseEntity.noContent().build();
    }

    // 관리자의 게시글 수정
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/admin/{postId}")
    public ResponseEntity<PostResponseDto> adminRewrite(
            @PathVariable Long postId,
            @Valid @RequestBody PostRequestDto dto
    ) {
        PostResponseDto response = postService.rewriteAsAdmin(postId, dto);
        return ResponseEntity.ok(response);
    }

    // 관리자의 게시글 삭제
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/admin/{postId}")
    public ResponseEntity<Void> adminDelete(@PathVariable Long postId) {
        postService.deleteAsAdmin(postId);
        return ResponseEntity.noContent().build();
    }


}
