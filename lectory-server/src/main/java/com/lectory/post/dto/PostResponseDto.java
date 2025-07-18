package com.lectory.post.dto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import com.lectory.common.domain.post.Post;
import com.lectory.common.domain.user.User;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Builder
public class PostResponseDto {
    private Long postId;
    private String title;
    private String content;
    private boolean isResolved;
    private int likeCount;
    private Set<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long userId;
    private String userNickname;

    public static PostResponseDto fromEntity(Post post) {
        Set<String> tagNames = post.getPostTags().stream()
                .map(pt -> pt.getTag().getName())
                .collect(Collectors.toSet());

        User user = post.getUserId();

        return PostResponseDto.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .content(post.getContent())
                .isResolved(post.isResolved())
                .likeCount(post.getLikeCount())
                .tags(tagNames)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())

                .userId(user != null ? user.getUserId() : null)
                .userNickname(user != null ? user.getNickname() : null)

                .build();
    }
}
