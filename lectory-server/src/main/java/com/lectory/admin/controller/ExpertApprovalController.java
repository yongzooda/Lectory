package com.lectory.admin.controller;

import com.lectory.admin.dto.ExpertApprovalRequestDto;
import com.lectory.admin.dto.ExpertResponseDto;
import com.lectory.admin.service.ExpertManageService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/expert-approval")
@RequiredArgsConstructor
public class ExpertApprovalController {

    private final ExpertManageService expertManageService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    @Operation(summary = "가입 승인 대기 전문가 목록 조회")
    public List<ExpertResponseDto> getPendingExperts() {
        return expertManageService.getPendingExperts();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PatchMapping
    @Operation(summary = "전문가 가입 승인 또는 보류 처리")
    public ResponseEntity<String> updateApprovalStatus(@RequestBody @Valid ExpertApprovalRequestDto dto) {
        System.out.println(">>> PATCH Controller 진입 성공");
        expertManageService.updateApprovalStatus(dto);
        return ResponseEntity.ok("처리 완료");
    }

}
