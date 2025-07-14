// Expert.java
package com.lectory.user.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * 전문가 엔티티 (User ↔ Expert 1:1 관계)
 */
@Entity
@Table(name = "expert")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expert {

    /** 전문가 고유 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expertId;

    /** 연결된 User 엔티티 (1:1) */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /** 업로드한 포트폴리오 파일 URL */
    @Column(length = 255)
    private String portfolioFileUrl;

    /** 승인 상태 (가입신청 → PENDING, 승인 → APPROVED, 반려 → REJECTED) */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    /** 프로필 이미지 URL */
    @Column(length = 255)
    private String profileImageUrl;

    public enum ApprovalStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
