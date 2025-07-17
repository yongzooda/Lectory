package com.lectory.admin.service;

import com.lectory.admin.dto.ExpertResponseDto;
import com.lectory.admin.repository.ExpertManageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpertManageService {
    private final ExpertManageRepository expertManageRepository;

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
}
