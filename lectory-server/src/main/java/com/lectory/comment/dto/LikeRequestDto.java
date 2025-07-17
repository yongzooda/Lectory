package com.lectory.comment.dto;

import com.lectory.common.domain.LikeTarget;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LikeRequestDto {
    private LikeTarget target;
    private Long targetId;
}
