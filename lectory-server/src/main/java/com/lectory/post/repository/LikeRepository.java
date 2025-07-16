package com.lectory.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.Like;
import com.lectory.common.domain.LikeTarget;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByTargetAndTargetIdAndUser_UserId(LikeTarget target, Long targetId, Long userId);
}