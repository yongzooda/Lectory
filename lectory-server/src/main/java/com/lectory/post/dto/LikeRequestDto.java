package com.lectory.post.dto;

import com.lectory.common.domain.LikeTarget;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LikeRequestDto {
    private LikeTarget target;
    private Long targetId;
}
