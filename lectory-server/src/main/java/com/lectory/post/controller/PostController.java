package com.lectory.post.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import com.lectory.post.dto.PostRequestDto;
import com.lectory.post.dto.PostResponseDto;
import com.lectory.post.service.PostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 글 등록
    @PostMapping
    public ResponseEntity<PostResponseDto> write(@RequestBody PostRequestDto dto,
                                                 @RequestParam Long userId) {
        PostResponseDto response = postService.write(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 글 수정
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDto> rewrite(@PathVariable Long postId,
                                                   @RequestBody PostRequestDto dto,
                                                   @RequestParam Long userId) {
        PostResponseDto response = postService.rewrite(postId, dto, userId);
        return ResponseEntity.ok(response);
    }

    // 글 상세 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> pick(@PathVariable Long postId) {
        PostResponseDto response = postService.pick(postId);
        return ResponseEntity.ok(response);
    }

    // 글 목록 조회 (페이징 처리)
    @GetMapping
    public ResponseEntity<Page<PostResponseDto>> view(@RequestParam Long userId,
                                                      @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
                                                      Pageable pageable) {
        Page<PostResponseDto> page = postService.view(userId, pageable);
        return ResponseEntity.ok(page);
    }

    // 글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(@PathVariable Long postId,
                                       @RequestParam Long userId) {
        postService.delete(postId, userId);
        return ResponseEntity.noContent().build();
    }
}
