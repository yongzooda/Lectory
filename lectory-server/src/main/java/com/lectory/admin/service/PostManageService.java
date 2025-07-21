package com.lectory.admin.service;

import com.lectory.admin.dto.PostSummaryDto;
import com.lectory.admin.repository.PostManageRepository;
import com.lectory.admin.repository.ReportManageRepository;
import com.lectory.common.domain.ReportTarget;
import com.lectory.common.domain.post.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostManageService {

    private final PostManageRepository postManageRepository;
    private final ReportManageRepository reportManageRepository;

    public List<PostSummaryDto> getAllPosts() {
        // 유저 이메일 포함 조회
        List<Post> posts = postManageRepository.findAllWithUser();

        return posts.stream()
                .map(post -> {
                    boolean isReported = reportManageRepository.existsByTargetAndTargetId(
                            ReportTarget.POST, post.getPostId());

                    return PostSummaryDto.builder()
                            .postId(post.getPostId())
                            .title(post.getTitle())
                            .authorEmail(post.getUserId().getEmail())
                            .createdAt(post.getCreatedAt().toString())
                            .reported(isReported) // 신고 여부 계산
                            .build();
                })
                .sorted(Comparator.comparing(PostSummaryDto::isReported).reversed()) // 신고 여부 먼저 정렬
                .collect(Collectors.toList());
    }
}
