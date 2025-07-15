// src/main/java/com/lectory/common/domain/Report.java
package com.lectory.common.domain;

import com.lectory.common.domain.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

/**
 * 신고 엔티티 (report)
 */
@Entity
@Table(name = "report")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    /** 신고 고유 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    /** 신고 대상 유형 (POST or COMMENT) */
    @Enumerated(EnumType.STRING)
    @Column(name = "target", length = 10, nullable = false)
    private ReportTarget target;

    /** 신고 대상 ID (post_id or comment_id) */
    @Column(name = "target_id", nullable = false)
    private Long targetId;

    /** 신고한 사용자 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 신고 내용 */
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    /** 신고 일자 */
    @Column(name = "created_at",
            nullable = false,
            updatable = false,
            columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    /** 처리 상태 (기본 PENDING) */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10, nullable = false,
            columnDefinition = "ENUM('PENDING','PROCESSED','REJECTED') DEFAULT 'PENDING'")
    private ReportStatus status = ReportStatus.PENDING;
}
