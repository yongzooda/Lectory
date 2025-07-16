package com.lectory.post.service;

import org.springframework.stereotype.Service;

import com.lectory.common.domain.Like;
import com.lectory.common.domain.LikeTarget;
import com.lectory.common.domain.user.User;
import com.lectory.post.repository.LikeRepository;
import com.lectory.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;

    @Transactional
    public void create(LikeTarget target, Long targetId, Long userId) {
        if (likeRepository.existsByTargetAndTargetIdAndUser_UserId(target, targetId, userId)) {
            throw new RuntimeException("이미 좋아요를 누른 대상입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Like like = Like.builder()
                .target(target)
                .targetId(targetId)
                .user(user)
                .build();

        likeRepository.save(like);
    }
}
