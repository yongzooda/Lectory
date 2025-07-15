package com.lectory.contentlibrary.student.dto;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollRequest {
    /** 수강신청을 요청하는 회원 ID */
    private Long memberId;
}