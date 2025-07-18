package com.lectory.admin.service;

import com.lectory.admin.dto.CommentManageResponseDto;
import com.lectory.admin.repository.CommentManageRepository;
import com.lectory.comment.dto.CommentRequestDto;
import com.lectory.comment.repository.CommentRepository;
import com.lectory.common.domain.comment.Comment;
import com.lectory.exception.CustomErrorCode;
import com.lectory.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentManageService {
    private final CommentManageRepository commentManageRepository;
    private final CommentRepository commentRepository;

    // Comment -> CommentManageResponseDto
    public List<CommentManageResponseDto> findAllComments() {
        List<Comment> comments = commentManageRepository.findAllComments();
        List<CommentManageResponseDto> dtos = new ArrayList<>();
        for (Comment comment : comments) {
            CommentManageResponseDto dto = new CommentManageResponseDto();

            dto.setCommentId(comment.getCommentId());
            dto.setPostId(comment.getPost().getPostId());
            dto.setUserId(comment.getUser().getUserId());
            dto.setUserType(comment.getUser().getUserType());
            dto.setContent(comment.getContent());
            dto.setResolved(comment.getPost().isResolved());
            dto.setLikeCount(comment.getLikeCount());
            dto.setCreatedAt(comment.getCreatedAt());
            dto.setAccepted(dto.isAccepted());

            dtos.add(dto);
        }
        return dtos;
    }

    @Transactional
    public void updateComment(Long commentId, CommentRequestDto dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.COMMENT_NOT_FOUND));
        comment.updateContent(dto.getContent());
        commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.COMMENT_NOT_FOUND));
        commentRepository.delete(comment);
    }
}
