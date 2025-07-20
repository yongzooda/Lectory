package com.lectory.admin.service;

import com.lectory.admin.dto.ExpertApprovalRequestDto;
import com.lectory.admin.dto.ExpertResponseDto;
import com.lectory.admin.repository.ExpertManageRepository;
import com.lectory.common.domain.user.Expert;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpertManageService {
    private final ExpertManageRepository expertManageRepository;

    // 가입되어 있는 전문가 전체 목록 조회
    public List<ExpertResponseDto> getAllExperts() {
        return expertManageRepository.findAllActiveExperts().stream()
                .map(expert -> {
                    var user = expert.getUser();
                    return ExpertResponseDto.builder()
                            .userId(user.getUserId())
                            .email(user.getEmail())
                            .nickname(user.getNickname())
                            .createdAt(user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss")))
                            .approvalStatus(expert.getApprovalStatus().name())
                            .portfolioFileUrl(expert.getPortfolioFileUrl())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 전문가 가입 승인 상태 목록 조회
    public List<ExpertResponseDto> getPendingExperts() {
        return expertManageRepository.findAllPendingExperts().stream()
                .map(expert -> {
                    var user = expert.getUser();
                    return ExpertResponseDto.builder()
                            .userId(user.getUserId())
                            .email(user.getEmail())
                            .nickname(user.getNickname())
                            .createdAt(user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss")))
                            .approvalStatus(expert.getApprovalStatus().name())
                            .portfolioFileUrl(expert.getPortfolioFileUrl())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 승인/보류 버튼 클릭 시 PATCH 요청 보내기
    @Transactional
    public void updateApprovalStatus(ExpertApprovalRequestDto dto) {
        System.out.println(">>> Service 진입: userId=" + dto.getExpertId() + ", status=" + dto.getStatus());

        Expert expert = expertManageRepository.findByUser_UserId(dto.getExpertId())
                .orElseThrow(() -> {
                    System.out.println(">>> ❌ 존재하지 않는 전문가 userId: " + dto.getExpertId());
                    return new IllegalArgumentException("존재하지 않는 전문가 userId: " + dto.getExpertId());
                });

        expert.setApprovalStatus(dto.getStatus());
        System.out.println(">>> 전문가 승인 상태 업데이트 완료: " + dto.getStatus());
    }

}