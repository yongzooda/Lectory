// File: com/lectory/contentlibrary/dto/LectureUpdateRequestDto.java
package com.lectory.contentlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 강의실 정보 수정 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureUpdateRequestDto {
    private String thumbnail;
    private String title;
    private String description;
    private String fileUrl;
    private Boolean isPaid;
}
