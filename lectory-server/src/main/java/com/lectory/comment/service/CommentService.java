package com.lectory.comment.service;

import com.lectory.comment.dto.CommentRequestDto;
import com.lectory.comment.dto.CommentResponseDto;
import com.lectory.comment.dto.LikeResponseDto;
import com.lectory.post.dto.LikeRequestDto;
import com.lectory.post.dto.ReportRequestDto;
import com.lectory.user.security.CustomUserDetail;

import java.util.List;

public interface CommentService {
    CommentResponseDto addComment(Long post_id, CommentRequestDto req, CustomUserDetail userDetail);
    CommentResponseDto addReply(Long postId, Long parentId, CommentRequestDto req, CustomUserDetail userDetail);
    CommentResponseDto updateComment(Long commentId, CommentRequestDto req, CustomUserDetail userDetail);
    void deleteComment(Long postId, Long commentId, CustomUserDetail userDetail);
    List<CommentResponseDto> getComments(Long postId);

    CommentResponseDto acceptComment(Long postId, Long commentId, CustomUserDetail userDetail);

    LikeResponseDto likeComment(Long postId, LikeRequestDto req, CustomUserDetail userDetail);

    void reportComment(ReportRequestDto req, CustomUserDetail userDetail);
}
