package com.lectory.admin.service;

import com.lectory.admin.dto.CommentManageResponseDto;
import com.lectory.admin.repository.CommentManageRepository;
import com.lectory.post.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;

import static com.lectory.common.domain.ReportTarget.COMMENT;

@Service
@RequiredArgsConstructor
public class CommentManageService {
    private final CommentManageRepository commentManageRepository;
    private final ReportRepository reportRepository;

    // Comment -> CommentManageResponseDto
    public List<CommentManageResponseDto> findAllComments() {
        List<CommentManageResponseDto> dtos =  commentManageRepository.findAllComments();
        for(CommentManageResponseDto dto : dtos) {
            dto.setReported(isReported(dto.getUserId(),dto.getUserId()));
        }
        return dtos;
    }

    public boolean isReported(Long targetId, Long userId) {
        return reportRepository.existsByTargetAndTargetIdAndUser_UserId(COMMENT, targetId, userId);
    }
}
