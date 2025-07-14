// ===== EnrollResponse.java =====
package com.lectory.contentlibrary.student.dto;

import lombok.*;

/**
 * 무료 구독자 수강신청 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollResponse {
    /** 처리 성공 여부 */
    private boolean success;
    /** 결과 메시지 */
    private String message;
    /** 강의실 ID */
    private Long lectureRoomId;
    /** 수강신청 완료 후 수강 여부 */
    private Boolean isEnrolled;
}