// 수정본: ChapterUpdateRequestDto.java
package com.lectory.contentlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;   // ← 추가

/**
 * 챕터 정보 수정 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterUpdateRequestDto {

    private String  chapterName;
    private String  expectedTime;
    private Integer orderNum;
    private String  videoUrl;

    /* ─── 태그 ─── */
    private List<String> tags;   // ← 추가
}
