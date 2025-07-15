package com.lectory.post.dto;

import com.lectory.common.domain.LikeTarget;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LikeRequestDto {
    private LikeTarget target;
    private Long targetId;
}
