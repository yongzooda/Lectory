package com.lectory.post.controller;

import org.hibernate.tool.schema.TargetType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lectory.common.domain.LikeTarget;
import com.lectory.post.dto.LikeRequestDto;
import com.lectory.post.service.LikeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class LikeController {

 private final LikeService likeService;

 @PostMapping("/{postId}/like")
 public ResponseEntity<Void> likePost(
		 @PathVariable Long postId,
         @AuthenticationPrincipal UserDetailsImpl userDetails) {

     likeService.create(LikeTarget.POST, postId, userDetails.getId());
     return ResponseEntity.ok().build();
 }
}
