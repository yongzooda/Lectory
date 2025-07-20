package com.lectory.admin.repository;

import com.lectory.admin.dto.CommentManageResponseDto;
import com.lectory.common.domain.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentManageRepository extends JpaRepository<Comment, Long> {

    @Query("""
    SELECT new com.lectory.admin.dto.CommentManageResponseDto(
        c.commentId, c.post.postId, c.post.title,
        c.user.userId, c.user.email,c.user.userType,
        c.content, p.isResolved, c.likeCount, c.createdAt,
        c.isAccepted, false
    )
    FROM Comment c
    JOIN c.post p
    ORDER BY c.createdAt DESC
    """)
    List<CommentManageResponseDto> findAllComments();
}
