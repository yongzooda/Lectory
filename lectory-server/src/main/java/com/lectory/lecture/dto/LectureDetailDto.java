// LectureDetailDto.java
package com.lectory.lecture.dto;

import java.util.List;

/**
 * 강의실 상세 조회 시 반환하는 DTO
 */
public record LectureDetailDto(
        String title,
        String coverImageUrl,
        String description,
        List<ChapterDto> chapters,
        List<CommentDto> lectureComments,
        Boolean isEnrolled,
        Boolean isPaid,
        Boolean canEnroll
) {}
