package com.lectory.contentlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureCreateRequestDto {
    private String title;
    private String description;
    private String thumbnail;
    private String fileUrl;
    private Boolean isPaid;
    private List<String> tags;         // 태그 이름 리스트
}