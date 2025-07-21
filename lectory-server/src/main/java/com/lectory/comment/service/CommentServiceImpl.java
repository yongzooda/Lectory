package com.lectory.comment.service;

import com.lectory.comment.dto.CommentRequestDto;
import com.lectory.comment.dto.CommentResponseDto;
import com.lectory.comment.dto.LikeResponseDto;
import com.lectory.comment.repository.CommentLikeRepository;
import com.lectory.comment.repository.CommentRepository;
import com.lectory.comment.service.mapper.CommentMapper;
import com.lectory.common.domain.*;
import com.lectory.common.domain.comment.Comment;
import com.lectory.common.domain.post.Post;
import com.lectory.common.domain.user.User;
import com.lectory.exception.CustomErrorCode;
import com.lectory.exception.CustomException;
import com.lectory.post.dto.LikeRequestDto;
import com.lectory.post.dto.ReportRequestDto;
import com.lectory.post.repository.PostRepository;
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
    private final PostRepository postRepository;
    private final CommentMapper commentMapper;

    @Transactional
    @Override
    public CommentResponseDto addComment(Long postId, CommentRequestDto req, CustomUserDetail userDetail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.POST_NOT_FOUND));

        String currentUserType = userDetail.getUser().getUserType().getUserType(); // 현재 로그인한 사용자 타입
        String postAuthorUserType = post.getUserId().getUserType().getUserType(); // 게시글 작성자 사용자 타입

        if (post.isOnlyExpert() && "FREE".equals(currentUserType)) {
            throw new CustomException(CustomErrorCode.POST_ONLY_EXPERT);
        }
        if ("EXPERT".equals(currentUserType) && !"PAID".equals(postAuthorUserType)) {
            throw new CustomException(CustomErrorCode.EXPERT_CAN_COMMENT_ON_PAID_ONLY);
        }
        Comment comment = commentMapper.getComment(postId, req, userDetail);
        commentRepository.save(comment);
        return commentMapper.getCommentResponse(comment, userDetail);
    }

    @Transactional
    @Override
    public CommentResponseDto addReply(Long postId, Long parentId, CommentRequestDto req, CustomUserDetail userDetail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.POST_NOT_FOUND));

        String currentUserType = userDetail.getUser().getUserType().getUserType(); // 현재 로그인한 사용자 타입
        String postAuthorUserType = post.getUserId().getUserType().getUserType(); // 게시글 작성자 사용자 타입

        if (post.isOnlyExpert() && "FREE".equals(currentUserType)) {
            throw new CustomException(CustomErrorCode.POST_ONLY_EXPERT);
        }
        if ("EXPERT".equals(currentUserType) && !"PAID".equals(postAuthorUserType)) {
            throw new CustomException(CustomErrorCode.EXPERT_CAN_COMMENT_ON_PAID_ONLY);
        }
        Comment comment = commentMapper.getReply(postId, parentId, req, userDetail);
        commentRepository.save(comment);
        return commentMapper.getCommentResponse(comment, userDetail);
    }

    @Transactional
    @Override
    public CommentResponseDto updateComment(Long commentId, CommentRequestDto req, CustomUserDetail userDetail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.COMMENT_NOT_FOUND));
        validateUser(comment, userDetail.getUser());
        comment.updateContent(req.getContent());
        commentRepository.save(comment);
        return commentMapper.getCommentResponse(comment, userDetail);
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
    public List<CommentResponseDto> getComments(Long postId, CustomUserDetail userDetail) {
        List<Comment> comment = commentRepository.findByPost_PostIdAndParentIsNullOrderByCreatedAtAsc(postId);
        return comment.stream()
                .map(com -> commentMapper.getCommentReplies(com, userDetail))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public CommentResponseDto acceptComment(Long postId, Long commentId, CustomUserDetail userDetail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.POST_NOT_FOUND));
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
        post.accept();
        postRepository.save(post);
        commentRepository.save(comment);

        return commentMapper.getCommentResponse(comment, userDetail);
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
                .createdAt(LocalDateTime.now())
                .status(ReportStatus.PENDING)
                .build();

        reportRepository.save(report);
    }

    // soft delete
    private void logicalDelete(Comment comment) {
        comment.setIsDeleted(true);
        comment.setUpdatedAt(LocalDateTime.now());
        for (Comment reply : comment.getReplies()) {
            logicalDelete(reply);
        }
    }

    // 작성자 본인인가
    private void validateUser(Comment comment, User user) {
        if (comment==null || !comment.getUser().getUserId().equals(user.getUserId())) {
            if(user.getUserType().getUserType().equals("ADMIN")){
                return;
            }
            throw new CustomException(CustomErrorCode.COMMENT_UNAUTHORIZED);
        }
    }
}
