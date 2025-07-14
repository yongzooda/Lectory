// ChapterDto.java
package com.lectory.lecture.dto;

/**
 * 강의실 상세 조회 시 각 챕터 정보를 담는 DTO
 */
public record ChapterDto(
        String chapterName,
        String expectedTime
) {}
