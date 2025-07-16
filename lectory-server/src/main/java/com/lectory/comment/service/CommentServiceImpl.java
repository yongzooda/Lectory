package com.lectory.comment.service;

import com.lectory.comment.dto.CommentRequestDto;
import com.lectory.comment.dto.CommentResponseDto;
import com.lectory.comment.repository.CommentRepository;
import com.lectory.comment.service.mapper.CommentMapper;
import com.lectory.common.domain.comment.Comment;
import com.lectory.common.domain.user.User;
import com.lectory.exception.CustomErrorCode;
import com.lectory.exception.CustomException;
import com.lectory.user.security.CustomUserDetail;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

    @Transactional
    @Override
    public CommentResponseDto addComment(Long postId, CommentRequestDto req, CustomUserDetail userDetail) {
        Comment comment = commentMapper.getComment(postId, req, userDetail);
        commentRepository.save(comment);
        return commentMapper.getCommentResponse(comment);
    }

    @Transactional
    @Override
    public CommentResponseDto addReply(Long postId, Long parentId, CommentRequestDto req, CustomUserDetail userDetail) {
        Comment comment = commentMapper.getReply(postId, parentId, req, userDetail);
        Comment parent = comment.getParent();
        parent.addReply(comment);
        commentRepository.save(comment);
        return commentMapper.getCommentResponse(comment);
    }

    @Override
    public CommentResponseDto updateComment(Long commentId, CommentRequestDto req, CustomUserDetail userDetail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.COMMENT_NOT_FOUND));
        validateUser(comment, userDetail.getUser());
        comment.updateContent(req.getContent());
        commentRepository.save(comment);
        return commentMapper.getCommentResponse(comment);
    }

    @Override
    public void deleteComment(Long postId, Long commentId, CustomUserDetail userDetail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getPost().getPostId().equals(postId)) {
            throw new IllegalArgumentException("댓글이 해당 게시글에 속하지 않습니다.");
        }

        validateUser(comment, userDetail.getUser());

        if ("EXPERT".equals(userDetail.getUser().getUserType().getUserType())) {
            logicalDelete(comment);
            commentRepository.save(comment);
        } else {
            commentRepository.delete(comment);
        }

    }

    private void logicalDelete(Comment comment) {
        comment.setIsDeleted(true);
        comment.setUpdatedAt(LocalDateTime.now());
        for (Comment reply : comment.getReplies()) {
            logicalDelete(reply);
        }
    }

    private void validateUser(Comment comment, User user) {
        if (comment==null || !comment.getUser().getUserId().equals(user.getUserId())) {
            throw new CustomException(CustomErrorCode.COMMENT_UNAUTHORIZED);
        }
    }
}
