package com.lectory.comment.service;

import com.lectory.comment.dto.CommentRequestDto;
import com.lectory.comment.dto.CommentResponseDto;
import com.lectory.comment.dto.LikeResponseDto;
import com.lectory.comment.repository.CommentLikeRepository;
import com.lectory.comment.repository.CommentRepository;
import com.lectory.comment.service.mapper.CommentMapper;
import com.lectory.common.domain.*;
import com.lectory.common.domain.comment.Comment;
import com.lectory.common.domain.user.User;
import com.lectory.exception.CustomErrorCode;
import com.lectory.exception.CustomException;
import com.lectory.post.dto.LikeRequestDto;
import com.lectory.post.dto.ReportRequestDto;
import com.lectory.post.repository.ReportRepository;
import com.lectory.user.security.CustomUserDetail;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final ReportRepository reportRepository;
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
        commentRepository.save(comment);
        return commentMapper.getCommentResponse(comment);
    }

    @Transactional
    @Override
    public CommentResponseDto updateComment(Long commentId, CommentRequestDto req, CustomUserDetail userDetail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.COMMENT_NOT_FOUND));
        validateUser(comment, userDetail.getUser());
        comment.updateContent(req.getContent());
        commentRepository.save(comment);
        return commentMapper.getCommentResponse(comment);
    }

    @Transactional
    @Override
    public void deleteComment(Long postId, Long commentId, CustomUserDetail userDetail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getPost().getPostId().equals(postId)) {
            throw new CustomException(CustomErrorCode.COMMENT_POST_MISMATCH);
        }

        validateUser(comment, userDetail.getUser());

        if ("EXPERT".equals(userDetail.getUser().getUserType().getUserType())) {
            logicalDelete(comment);
            commentRepository.save(comment);
        } else {
            commentRepository.delete(comment);
        }

    }

    @Transactional
    @Override
    public List<CommentResponseDto> getComments(Long postId) {
        List<Comment> comment = commentRepository.findByPost_PostIdAndParentIsNullOrderByCreatedAtAsc(postId);
        return comment.stream()
                .map(commentMapper::getCommentReplies)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public CommentResponseDto acceptComment(Long postId, Long commentId, CustomUserDetail userDetail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getPost().getPostId().equals(postId)) {
            throw new CustomException(CustomErrorCode.COMMENT_POST_MISMATCH);
        }

        Long userId = comment.getPost().getUserId().getUserId();
        Long currentId = userDetail.getUser().getUserId();

        if (!userId.equals(currentId)) {
            throw new CustomException(CustomErrorCode.COMMENT_UNAUTHORIZED);
        }

        if (commentRepository.existsByPost_PostIdAndIsAcceptedTrue(postId)) {
            throw new CustomException(CustomErrorCode.COMMENT_ALREADY_ACCEPTED);
        }

        comment.accept();
        commentRepository.save(comment);

        return commentMapper.getCommentResponse(comment);
    }

    @Transactional
    @Override
    public LikeResponseDto likeComment(Long postId, LikeRequestDto req, CustomUserDetail userDetail) {

        LikeTarget target = req.getTarget();
        Long commentId = req.getTargetId();
        Long userId = userDetail.getUser().getUserId();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getPost().getPostId().equals(postId)) {
            throw new CustomException(CustomErrorCode.COMMENT_POST_MISMATCH);
        }

        Optional<Like>  exist = commentLikeRepository.findByTargetAndTargetIdAndUser_UserId(LikeTarget.COMMENT, commentId, userId);

        if (exist.isPresent()) {
            commentLikeRepository.delete(exist.get());
        } else {
            Like like = Like.builder()
                    .target(target)
                    .targetId(commentId)
                    .user(userDetail.getUser())
                    .build();
            commentLikeRepository.save(like);
        }

        Long likeCount = commentLikeRepository.countByTargetAndTargetId(target, commentId);
        boolean liked = commentLikeRepository.findByTargetAndTargetIdAndUser_UserId(target, commentId, userId).isPresent();

        return LikeResponseDto.builder()
                .commentId(commentId)
                .likeCount(likeCount)
                .liked(liked)
                .build();
    }

    @Override
    public void reportComment(ReportRequestDto req, CustomUserDetail userDetail) {
        ReportTarget target = req.getTarget();
        Long commentId = req.getTargetId();
        Long userId = userDetail.getUser().getUserId();

        if (reportRepository.existsByTargetAndTargetIdAndUser_UserId(target, commentId, userId)) {
            throw new CustomException(CustomErrorCode.REPORT_ALREADY_EXISTS);
        }

        Report report = Report.builder()
                .target(target)
                .targetId(commentId)
                .user(userDetail.getUser())
                .content(req.getContent())
                .status(ReportStatus.PENDING)
                .build();

        reportRepository.save(report);
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
