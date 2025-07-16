// File: com/lectory/contentlibrary/dto/ChapterUpdateRequestDto.java
package com.lectory.contentlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 챕터 정보 수정 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterUpdateRequestDto {
    private String chapterName;
    private String expectedTime;
    private Integer orderNum;
    private String videoUrl;
}