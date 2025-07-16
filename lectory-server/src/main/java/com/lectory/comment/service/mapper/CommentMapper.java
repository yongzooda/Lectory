package com.lectory.comment.service.mapper;

import com.lectory.comment.dto.CommentRequestDto;
import com.lectory.comment.dto.CommentResponseDto;
import com.lectory.comment.repository.CommentRepository;
import com.lectory.common.domain.comment.Comment;
import com.lectory.common.domain.post.Post;
import com.lectory.post.repository.PostRepository;
import com.lectory.user.security.CustomUserDetail;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Component
public class CommentMapper {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    // 요청 -> 댓글
    public Comment getComment(Long postId, CommentRequestDto req, CustomUserDetail userDetail) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        return Comment.builder()
                .post(post)
                .user(userDetail.getUser())
                .parent(null)
                .likeCount(0)
                .content(req.getContent().trim())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isAccepted(false)
                .isDeleted(false)
                .build();
    }

    // 요청 -> 대댓글
    public Comment getReply(Long postId, Long parentId, CommentRequestDto req, CustomUserDetail userDetail) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        Comment parent = commentRepository.findById(parentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + parentId));
        return Comment.builder()
                .post(post)
                .user(userDetail.getUser())
                .parent(parent)
                .likeCount(0)
                .content(req.getContent().trim())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isAccepted(false)
                .isDeleted(false)
                .build();
    }

    // Comment -> DTO
    public CommentResponseDto getCommentResponse(Comment comment) {
        return CommentResponseDto.builder()
                .postId(comment.getPost().getPostId())
                .userId(comment.getUser().getUserId())
                .parentId(comment.getParent()!=null?comment.getParent().getCommentId():null)
                .content(comment.getContent())
                .likeCount(comment.getLikeCount())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .isAccepted(comment.getIsAccepted())
                .isDeleted(comment.getIsDeleted())
                .build();
    }

    // 댓글&대댓글 -> DTO
    public CommentResponseDto getCommentReplies(Comment comment) {
        CommentResponseDto res = getCommentResponse(comment);
        if (comment.getReplies()!=null & !comment.getReplies().isEmpty()) {
            List<CommentResponseDto> replies = comment.getReplies().stream().map(this::getCommentReplies)
                    .sorted(Comparator.comparing(CommentResponseDto::getCreatedAt))
                    .collect(Collectors.toList());
            res.setReplies(replies);
        }
        return res;
    }
}
