// LectureRoomSummaryDto.java
package com.lectory.contentlibrary.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 강의실 목록 조회 시 반환되는 요약 정보 DTO
 */
@Getter
@Builder
public class LectureRoomSummaryDto {

    private final Long lectureRoomId;
    private final String thumbnail;       // coverImageUrl을 매핑
    private final String title;
    private final String expertName;
    private final Integer enrollmentCount;
    private final Boolean isPaid;
    private final Boolean canEnroll;

}
