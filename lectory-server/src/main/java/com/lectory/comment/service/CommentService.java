package com.lectory.comment.service;

import com.lectory.comment.dto.CommentRequestDto;
import com.lectory.comment.dto.CommentResponseDto;
import com.lectory.user.security.CustomUserDetail;

public interface CommentService {
    CommentResponseDto addComment(Long post_id, CommentRequestDto commentRequestDto, CustomUserDetail userDetail);
    CommentResponseDto addReply(Long postId, Long parentId, CommentRequestDto req, CustomUserDetail userDetail);
    CommentResponseDto updateComment(Long commentId, CommentRequestDto req, CustomUserDetail userDetail);
    void deleteComment(Long postId, Long commentId, CustomUserDetail userDetail);
}
