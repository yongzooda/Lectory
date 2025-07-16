package com.lectory.contentlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 챕터(강의) 신규 생성 요청용 DTO */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterCreateRequestDto {

    /* ─── 소유·위치 정보 ─── */
    private Long expertId;        // 작성자(전문가) id
    private Long lectureRoomId;   // 소속 강의실 id

    /* ─── 챕터 자체 정보 ─── */
    private String  chapterName;
    private String  expectedTime;
    private Integer orderNum;
    private String  videoUrl;
}
