package com.lectory.contentlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** 강의실(LectureRoom) 신규 생성 요청 DTO */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureCreateRequestDto {

    /* ─── 필수 식별 정보 ─── */
    private Long expertId;          // ★ 추가 : Expert PK

    /* ─── 강의실 메타 ─── */
    private String coverImageUrl;
    private String title;
    private String description;
    private String fileUrl;
    private Boolean isPaid;

    /* ─── 태그 (선택) ─── */
    private List<String> tags;
}
