// 수정본: ChapterCreateRequestDto.java
package com.lectory.contentlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** 챕터(강의) 신규 생성 요청용 DTO */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterCreateRequestDto {

    /* ─── 소속 정보 ─── */
    private Long lectureRoomId;     // 소속 강의실 ID

    /* ─── 챕터 자체 정보 ─── */
    private String  chapterName;
    private String  expectedTime;
    private Integer orderNum;
    private String  videoUrl;

    /* ─── 태그 ─── */
    private List<String> tags;      // ← 추가
}
