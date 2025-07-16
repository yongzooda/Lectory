package com.lectory.comment.repository;

import com.lectory.common.domain.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost_PostIdAndParentIsNullOrderByCreatedAtAsc(Long postId);
}
