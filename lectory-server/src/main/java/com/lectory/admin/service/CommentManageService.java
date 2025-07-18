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
        return commentManageRepository.findAllComments();
    }


}
