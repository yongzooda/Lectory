package com.lectory.post.service;

import org.springframework.stereotype.Service;

import com.lectory.common.domain.Like;
import com.lectory.common.domain.LikeTarget;
import com.lectory.post.repository.LikeRepository;
import com.lectory.post.dto.LikeRequestDto;
import com.lectory.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;

    @Transactional
    public long toggle(LikeTarget targetType, Long targetId, Long userId) {
        Optional<Like> existingLike = likeRepository
                .findByTargetAndTargetIdAndUser_UserId(targetType, targetId, userId);

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

        return likeRepository.countByTargetAndTargetId(targetType, targetId);
    }

    @Transactional
    public long toggle(LikeRequestDto dto, Long userId) {
        return toggle(dto.getTarget(), dto.getTargetId(), userId);
    }

}
