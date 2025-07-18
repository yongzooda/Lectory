// LectureRoomSummaryDto.java
package com.lectory.contentlibrary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

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

    /** JSON 키를 정확히 "isEnrolled" 로 내보내도록 강제 */
    @JsonProperty("isEnrolled")
    private final Boolean enrolled;

    private final Boolean canEnroll;
    private List<String> tags;

}
