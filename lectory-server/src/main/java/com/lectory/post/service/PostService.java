package com.lectory.post.service;

import java.util.*;
import java.util.stream.Collectors;

import com.lectory.admin.repository.ReportManageRepository;
import com.lectory.comment.repository.CommentRepository;
import com.lectory.post.repository.PostTagRepository;
import com.lectory.user.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.lectory.post.dto.PostRequestDto;
import com.lectory.post.dto.PostResponseDto;
import com.lectory.common.domain.Tag;
import com.lectory.common.domain.post.*;
import com.lectory.post.repository.PostRepository;
import com.lectory.user.repository.UserRepository;
import com.lectory.common.domain.user.User;
import com.lectory.common.repository.TagRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final UserService userService;

    // 글 등록
    @Transactional
    public PostResponseDto write(PostRequestDto dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        boolean onlyExpert = dto.isOnlyExpert();

        if (onlyExpert && !"PAID".equals(user.getUserType().getUserType())) {
            throw new IllegalArgumentException("전문가 답변 허용은 PAID 구독자만 가능합니다.");
        }

        Post post = Post.builder()
                .userId(user)
                .title(dto.getTitle())
                .content(dto.getContent())
                .onlyExpert(onlyExpert)
                .isResolved(false)
                .likeCount(0)
                .build();

        Set<PostTag> postTags = new HashSet<>();
        for (String tagName : dto.getTagNames()) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 태그입니다. id: " + tagName));

            PostTag postTag = PostTag.builder()
                    .post(post)
                    .tag(tag)
                    .id(new PostTagId(null, tag.getTagId()))
                    .build();

            postTags.add(postTag);
        }
        post.setPostTags(postTags);

        postRepository.save(post);

        return PostResponseDto.fromEntity(post);
    }

    // 글 수정
    @Transactional
    public PostResponseDto rewrite(Long postId, PostRequestDto dto, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
        User user = userService.getUser(userId);

        if (!user.getUserType().getUserType().equals("ADMIN")) {
            if (!post.getUserId().getUserId().equals(userId)) {
                throw new SecurityException("본인만 글을 수정할 수 있습니다.");
            }
        }
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());

        Set<String> newTagNames = new HashSet<>(dto.getTagNames());

        // 현재 Post에 연결된 태그 이름 셋
        Set<String> existingTagNames = post.getPostTags().stream()
                .map(postTag -> postTag.getTag().getName())
                .collect(Collectors.toSet());

        // 삭제할 태그: 기존에는 있는데 새로는 없는 것
        Iterator<PostTag> iterator = post.getPostTags().iterator();
        while (iterator.hasNext()) {
            PostTag postTag = iterator.next();
            String tagName = postTag.getTag().getName();
            if (!newTagNames.contains(tagName)) {
                iterator.remove();
                postTag.setPost(null);
            }
        }

        // 추가할 태그: 새로 들어온 것 중 기존에 없는 것
        for (String tagName : newTagNames) {
            if (!existingTagNames.contains(tagName)) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 태그: " + tagName));

                PostTag postTag = PostTag.builder()
                        .post(post)
                        .tag(tag)
                        .id(new PostTagId(post.getPostId(), tag.getTagId()))
                        .build();

                post.getPostTags().add(postTag);
            }
        }

        postRepository.save(post);

        return PostResponseDto.fromEntity(post);
    }



    // 글 상세 조회
    @Transactional(readOnly = true)
    public PostResponseDto pick(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
        return PostResponseDto.fromEntity(post);
    }

    // 글 목록 조회(페이징, 구독자별 필터링)
    @Transactional(readOnly = true)
    public Page<PostResponseDto> view(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        Page<Post> posts;

        if ("EXPERT".equals(user.getUserType().getUserType())) {
            // 전문가: onlyExpert=true인 글만 조회
            posts = postRepository.findByOnlyExpertTrueOrderByCreatedAtDesc(pageable);
        } else {
            // Free, Paid: 전체 글 최신순 조회
            posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return posts.map(PostResponseDto::fromEntity);
    }

    // 글 삭제
    @Transactional
    public void delete(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        User user = userService.getUser(userId);
        if(!user.getUserType().getUserType().equals("ADMIN")) {
            if (!post.getUserId().getUserId().equals(userId)) {
                throw new SecurityException("본인만 글을 삭제할 수 있습니다.");
            }
        }
        // 자식 댓글(대댓글) 먼저 삭제
        commentRepository.deleteAllChildCommentsByPostId(postId);

        // 부모 댓글 삭제
        commentRepository.deleteAllParentCommentsByPostId(postId);

        postRepository.delete(post);
    }
}
