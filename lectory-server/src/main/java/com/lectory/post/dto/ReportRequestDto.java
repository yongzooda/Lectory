package com.lectory.post.dto;

import com.lectory.common.domain.ReportTarget;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReportRequestDto {
    private ReportTarget target;
    private Long targetId;
    private String content;
}