package com.lectory.comment.repository;

import com.lectory.common.domain.ReportTarget;
import com.lectory.common.domain.comment.Comment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 게시글의 부모 댓글들만 조회 및 createdAt 오름차순 정렬
    List<Comment> findByPost_PostIdAndParentIsNullOrderByCreatedAtAsc(Long postId);
    // 게시글에 이미 채택된 댓글이 있는지 확인
    boolean existsByPost_PostIdAndIsAcceptedTrue(Long postId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.parent.commentId IS NOT NULL AND c.post.postId = :postId")
    void deleteAllChildCommentsByPostId(@Param("postId") Long postId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.parent.commentId IS NULL AND c.post.postId = :postId")
    void deleteAllParentCommentsByPostId(@Param("postId") Long postId);
}
