// src/main/java/com/lectory/common/domain/Like.java
package com.lectory.common.domain;

import com.lectory.common.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * 좋아요 엔티티 (like)
 */
@Entity
@Table(name = "`like`")  // 필요 시 백틱으로 예약어 충돌을 방지
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Like {

    /** 좋아요 고유 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;

    /** 좋아요 유형 (POST or COMMENT) */
    @Enumerated(EnumType.STRING)
    @Column(name = "target", length = 10, nullable = false,
            columnDefinition = "ENUM('POST','COMMENT')")
    private LikeTarget target;

    /** 좋아요 대상 ID (post_id or comment_id) */
    @Column(name = "target_id", nullable = false)
    private Long targetId;

    /** 좋아요 누른 사용자 (FK → user.user_id) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
