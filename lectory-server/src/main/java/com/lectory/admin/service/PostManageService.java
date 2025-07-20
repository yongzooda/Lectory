package com.lectory.admin.service;

import com.lectory.admin.dto.PostSummaryDto;
import com.lectory.admin.repository.PostManageRepository;
import com.lectory.admin.repository.ReportManageRepository;
import com.lectory.common.domain.ReportTarget;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostManageService {

    private final PostManageRepository postManageRepository;
    private final ReportManageRepository reportManageRepository;

    public List<PostSummaryDto> getAllPosts() {
        return postManageRepository.findAllWithUser().stream()
                .map(post -> PostSummaryDto.builder()
                        .postId(post.getPostId())
                        .title(post.getTitle())
                        .authorEmail(post.getUserId().getEmail()) // 수정된 부분
                        .createdAt(post.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss")))
                        .isReported(reportManageRepository.existsByTargetAndTargetId(ReportTarget.POST, post.getPostId())) // 수정된 부분
                        .build())
                .collect(Collectors.toList());
    }
}
