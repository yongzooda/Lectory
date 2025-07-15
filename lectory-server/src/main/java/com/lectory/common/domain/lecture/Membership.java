// Membership.java
package com.lectory.common.domain.lecture;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "membership")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long membershipId;

    /** 수강생 회원 ID */
    @Column(nullable = false)
    private Long userId;

    /** 수강 신청한 강의실 ID */
    @Column(nullable = false)
    private Long lectureRoomId;

    /** 수강 신청 일시 */
    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime enrolledAt = LocalDateTime.now();
}
