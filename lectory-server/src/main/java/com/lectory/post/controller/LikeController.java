package com.lectory.post.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lectory.common.domain.LikeTarget;
import com.lectory.post.service.LikeService;
import com.lectory.user.security.CustomUserDetail;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetail userDetail) {

        Long userId = userDetail.getUser().getUserId();
        likeService.create(LikeTarget.POST, postId, userId);
        return ResponseEntity.ok().build();
    }
}
