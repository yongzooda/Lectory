// LectureRoomSummaryDto.java
package com.lectory.lecture.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 강의실 목록 조회 시 반환되는 요약 정보 DTO
 */
@Getter
@Builder
public class LectureRoomSummaryDto {

    private final Long lectureRoomId;
    private final String thumbnail;
    private final String title;
    private final String expertName;
    private final Double rating;
    private final Integer enrollmentCount;
    private final Boolean isPaid;
    private final Boolean canEnroll;

}
