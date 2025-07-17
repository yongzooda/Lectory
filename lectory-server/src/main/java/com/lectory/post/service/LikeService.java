package com.lectory.post.service;

import org.springframework.stereotype.Service;

import com.lectory.common.domain.Like;
import com.lectory.common.domain.LikeTarget;
import com.lectory.common.domain.user.User;
import com.lectory.post.repository.LikeRepository;
import com.lectory.post.repository.PostRepository;
import com.lectory.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public void toggle(LikeTarget targetType, Long targetId, Long userId) {
        Optional<Like> existingLike = likeRepository.findByTargetAndTargetIdAndUser_UserId(
                targetType, targetId, userId
        );

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            Like like = Like.builder()
                    .target(targetType)
                    .targetId(targetId)
                    .user(userRepository.getReferenceById(userId))
                    .build();
            likeRepository.save(like);
        }
    }
}
