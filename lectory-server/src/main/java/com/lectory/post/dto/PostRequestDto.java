package com.lectory.post.dto;

import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PostRequestDto {
    private Long userId;
    private String title;
    private String content;
    private boolean onlyExpert;
    private Set<Long> tagIds;
}
