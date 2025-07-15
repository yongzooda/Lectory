// LectureService.java
package com.lectory.lecture.service;

import com.lectory.lecture.dto.LectureRoomSummaryDto;
import com.lectory.lecture.dto.LectureDetailDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LectureService {

    /**
     * 강의실 목록 조회 (페이징 + 정렬)
     */
    Page<LectureRoomSummaryDto> listLectureRooms(
            Long memberId,
            int page,
            int size,
            String sort
    );

    /**
     * 강의실 검색 (페이징 + 정렬 + 태그 필터링)
     */
    Page<LectureRoomSummaryDto> searchLectureRooms(
            Long memberId,
            String search,
            List<String> tags,
            int page,
            int size,
            String sort
    );

    /**
     * 강의실 상세 조회
     */
    LectureDetailDto getLectureDetail(
            Long memberId,
            Long lectureRoomId
    );
}
