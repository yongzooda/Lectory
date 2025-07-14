// LectureService.java
package com.lectory.lecture.service;

import com.lectory.lecture.dto.LectureRoomSummaryDto;
import com.lectory.lecture.dto.LectureDetailDto;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * 공통 강의 조회 및 검색, 상세 조회 기능을 제공하는 서비스 인터페이스
 */
public interface LectureService {

    /**
     * 사용자의 구독 유형(Free/Paid/Expert)에 따라
     * 페이지네이션된 강의실 요약 목록을 반환합니다.
     *
     * @param userId    조회용 회원 ID
     * @param page      페이지 번호 (0부터 시작)
     * @param size      페이지 크기
     * @param sort      정렬 키워드 ("popularity" 또는 "latest")
     * @return          LectureRoomSummaryDto를 담은 Page 객체
     */
    Page<LectureRoomSummaryDto> listLectureRooms(Long userId,
                                                 int page,
                                                 int size,
                                                 String sort);

    /**
     * 검색어 및 선택 태그를 바탕으로
     * 페이지네이션된 강의실 요약 목록을 반환합니다.
     *
     * @param userId    조회용 회원 ID
     * @param search    검색어
     * @param tags      필터링할 태그 이름 목록 (없으면 전체)
     * @param page      페이지 번호 (0부터 시작)
     * @param size      페이지 크기
     * @param sort      정렬 키워드 ("relevance" 또는 "latest")
     * @return          LectureRoomSummaryDto를 담은 Page 객체
     */
    Page<LectureRoomSummaryDto> searchLectureRooms(Long userId,
                                                   String search,
                                                   List<String> tags,
                                                   int page,
                                                   int size,
                                                   String sort);

    /**
     * 특정 강의실의 상세 정보를 조회합니다.
     *
     * @param userId        조회용 회원 ID
     * @param lectureRoomId 조회할 강의실 ID
     * @return              강의실 상세 정보 DTO
     */
    LectureDetailDto getLectureDetail(Long userId,
                                      Long lectureRoomId);
}
