package com.lectory.admin.controller;

import com.lectory.admin.dto.ExpertResponseDto;
import com.lectory.admin.service.ExpertManageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/experts")
@RequiredArgsConstructor
public class ExpertManageController {
    private final ExpertManageService expertManageService;

    @Operation(summary = "전문가 목록 조회", description = "가입 승인 여부와 포트폴리오 포함된 전문가 전체 목록을 반환함.")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public List<ExpertResponseDto> getExperts() {
        return expertManageService.getAllExperts();
    }
}
