package com.lectory.common.domain.pay;

import com.lectory.common.domain.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

/**
 * 결제 내역 엔티티 (pay_history)
 */
@Entity
@Table(name = "pay_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayHistory {

    /** 결제 내역 고유 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pay_history_id")
    private Long payHistoryId;

    /** 결제한 회원 (FK → user.user_id) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 결제 일자 */
    @Column(name = "paid_at", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime paidAt;
}
