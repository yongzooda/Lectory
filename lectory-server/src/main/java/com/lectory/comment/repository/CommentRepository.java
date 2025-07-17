package com.lectory.comment.repository;

import com.lectory.common.domain.ReportTarget;
import com.lectory.common.domain.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 게시글의 부모 댓글들만 조회 및 createdAt 오름차순 정렬
    List<Comment> findByPost_PostIdAndParentIsNullOrderByCreatedAtAsc(Long postId);
    // 게시글에 이미 채택된 댓글이 있는지 확인
    boolean existsByPost_PostIdAndIsAcceptedTrue(Long postId);
}
