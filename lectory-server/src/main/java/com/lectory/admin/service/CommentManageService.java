package com.lectory.admin.service;

import com.lectory.admin.dto.CommentManageResponseDto;
import com.lectory.admin.repository.CommentManageRepository;
import com.lectory.common.domain.comment.Comment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentManageService {
    private final CommentManageRepository commentManageRepository;

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
}
