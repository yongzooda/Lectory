package com.lectory.contentlibrary.dto;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollRequestDto {
    /** 수강신청을 요청하는 회원 ID */
    private Long memberId;
}