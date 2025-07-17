package com.lectory.comment.repository;

import com.lectory.common.domain.Like;
import com.lectory.common.domain.LikeTarget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<Like, Long> {
    long countByTargetAndTargetId(LikeTarget target, Long targetId);

    Optional<Like> findByTargetAndTargetIdAndUser_UserId(LikeTarget target, Long targetId, Long userId);
}
