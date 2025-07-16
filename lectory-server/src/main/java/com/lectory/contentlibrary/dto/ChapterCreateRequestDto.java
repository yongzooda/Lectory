package com.lectory.contentlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterCreateRequestDto {
    private String chapterName;
    private String expectedTime;
    private Integer orderNum;
    private String videoUrl;
}