// ChapterDto.java
package com.lectory.contentlibrary.dto;

/**
 * 강의실 상세 조회 시 각 챕터 정보를 담는 DTO
 */
public record ChapterDto(
        Long chapterId,
        String chapterName,
        String expectedTime,
        Integer orderNum,
        String videoUrl
) {}
