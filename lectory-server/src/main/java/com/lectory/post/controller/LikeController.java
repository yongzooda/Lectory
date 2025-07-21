package com.lectory.post.controller;

import com.lectory.post.dto.LikeResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.lectory.post.dto.LikeRequestDto;
import com.lectory.post.service.LikeService;
import com.lectory.user.security.CustomUserDetail;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/{postId}/like")
    public ResponseEntity<LikeResponseDto> toggleLike(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestBody LikeRequestDto dto
    ) {
        Long userId = userDetail.getUser().getUserId();
        LikeResponseDto res = likeService.toggle(dto, userId);
        return ResponseEntity.ok(res);
    }

}
