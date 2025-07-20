// ===== EnrollResponse.java =====
package com.lectory.contentlibrary.dto;

import lombok.*;

/**
 * 수강신청 응답 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollResponseDto {
    /** 처리 성공 여부 */
    private boolean success;
    /** 결과 메시지 */
    private String message;
    /** 강의실 ID */
    private Long lectureRoomId;
    /** 수강신청 완료 후 수강 여부 */
    private Boolean isEnrolled;

    private String paymentUrl;
}
