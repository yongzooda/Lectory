package com.lectory.post.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lectory.post.dto.ReportRequestDto;
import com.lectory.post.service.ReportService;
import com.lectory.user.security.CustomUserDetail;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {

 private final ReportService reportService;

 @PostMapping
 public ResponseEntity<Void> createReport(
         @RequestBody @Valid ReportRequestDto dto,
         @AuthenticationPrincipal CustomUserDetail userDetail) {

	 Long userId = userDetail.getUser().getUserId();
	 
	 reportService.create(dto.getTarget(), dto.getTargetId(), userDetail.getId(), dto.getContent());
     return ResponseEntity.ok().build();
 }
}
