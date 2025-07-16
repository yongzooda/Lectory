package com.lectory.contentlibrary.dto;

import lombok.Builder;

import java.util.List;

/**
 * 강의실 상세 조회 DTO (학생/전문가 공용)
 */

@Builder
public record LectureDetailDto(
        Long lectureRoomId,
        String title,
        String coverImageUrl,
        String description,
        String expertName,
        String createdAt,
        String updatedAt,
        Integer enrollmentCount,
        List<ChapterDto> chapters,
        List<CommentDto> lectureComments,
        Boolean isEnrolled,
        Boolean isPaid,
        Boolean canEnroll
) {}
