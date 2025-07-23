package com.lectory.admin.service;

import com.lectory.admin.dto.PostSummaryDto;
import com.lectory.admin.repository.PostManageRepository;
import com.lectory.admin.repository.ReportManageRepository;
import com.lectory.comment.repository.CommentRepository;
import com.lectory.common.domain.Report;
import com.lectory.common.domain.ReportStatus;
import com.lectory.common.domain.ReportTarget;
import com.lectory.common.domain.Tag;
import com.lectory.post.service.PostService;
import com.lectory.common.domain.post.Post;
import com.lectory.common.domain.post.PostTag;
import com.lectory.common.domain.post.PostTagId;
import com.lectory.common.repository.TagRepository;
import com.lectory.post.dto.PostRequestDto;
import com.lectory.post.dto.PostResponseDto;
import com.lectory.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostManageService {

    private final PostManageRepository postManageRepository;
    private final ReportManageRepository reportManageRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final PostService postService;

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

    // 관리자가 게시글 수정
    @Transactional
    public PostResponseDto rewriteAsAdmin(Long postId, PostRequestDto dto, Long userId) {
        Post post = postManageRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // ① 신고 상태 확인
        List<Report> reports = reportManageRepository.findByTargetAndTargetIdAndStatus(
                ReportTarget.POST, postId, ReportStatus.PENDING
        );

        if (reports.isEmpty()) {
//            throw new IllegalStateException("신고된 게시글만 수정할 수 있습니다.");
            // 신고가 없으면 일반 수정 로직만 수행하고 종료
            return postService.rewrite(postId, dto, userId);
        }

        // ② 게시글 수정
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());

        post.getPostTags().clear();
        Set<PostTag> newPostTags = new HashSet<>();
        for (String tagName : dto.getTagNames()) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 태그입니다. id: " + tagName));
            PostTag postTag = PostTag.builder()
                    .post(post)
                    .tag(tag)
                    .id(new PostTagId(post.getPostId(), tag.getTagId()))
                    .build();
            newPostTags.add(postTag);
        }
        post.setPostTags(newPostTags);

        // ③ 신고 상태 처리 완료로 변경
        reports.forEach(r -> r.setStatus(ReportStatus.PROCESSED));

        return PostResponseDto.fromEntity(post);
    }

    // 관리자가 게시글 삭제
    @Transactional
    public void deleteAsAdmin(Long postId, Long userId) {
        Post post = postManageRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // ① 신고 상태 확인
        List<Report> reports = reportManageRepository.findByTargetAndTargetIdAndStatus(
                ReportTarget.POST, postId, ReportStatus.PENDING
        );

        if (reports.isEmpty()) {
//            throw new IllegalStateException("신고된 게시글만 삭제할 수 있습니다.");
            postService.delete(postId, userId);
            return;
        }

        // ② 댓글 삭제
        commentRepository.deleteAllChildCommentsByPostId(postId);
        commentRepository.deleteAllParentCommentsByPostId(postId);

        // ③ 게시글 삭제 (필요 시 soft delete로 대체 가능)
        postRepository.delete(post);

        // ④ 신고 상태 처리 완료로 변경
        reports.forEach(r -> r.setStatus(ReportStatus.PROCESSED));
    }
}
