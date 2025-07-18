package com.lectory.admin.repository;

import com.lectory.common.domain.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentManageRepository extends JpaRepository<Comment, Long> {

    @Query(""" 
    SELECT c.commentId, c.post.postId, c.user.userId,
        c.content, p.isResolved, c.createdAt, c.isAccepted
    FROM
    Comment c, Post p
    where c.post.postId = p.postId
    ORDER BY c.createdAt DESC
    """)
    List<Comment> findAllComments();

    Comment findCommentById(Long id);

    Comment deleteCommentById(Long id);
}
