package com.lectory.post.service;

import com.lectory.post.dto.LikeResponseDto;
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
    public LikeResponseDto toggle(LikeRequestDto dto, Long userId) {
        LikeTarget target = dto.getTarget();
        Long targetId = dto.getTargetId();

        Optional<Like> existingLike = likeRepository
                .findByTargetAndTargetIdAndUser_UserId(target, targetId, userId);

        boolean liked;
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            liked = false;
        } else {
            Like like = Like.builder()
                    .target(target)
                    .targetId(targetId)
                    .user(userRepository.getReferenceById(userId))
                    .build();
            likeRepository.save(like);
            liked = true;
        }

        long likeCount = likeRepository.countByTargetAndTargetId(target, targetId);

        return new LikeResponseDto(likeCount, liked);
    }

    public LikeResponseDto get(LikeRequestDto dto, Long userId) {
        LikeTarget target = dto.getTarget();
        Long targetId = dto.getTargetId();

        Optional<Like> existingLike = likeRepository
                .findByTargetAndTargetIdAndUser_UserId(target, targetId, userId);

        if(existingLike.isPresent()) {
            return new LikeResponseDto(likeRepository.countByTargetAndTargetId(target, targetId), true);
        } else {
            return new LikeResponseDto(likeRepository.countByTargetAndTargetId(target, targetId), false);
        }
    }
}
