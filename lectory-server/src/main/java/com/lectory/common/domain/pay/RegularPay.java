package com.lectory.common.domain.pay;

import com.lectory.common.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * 정기 결제 관리 엔티티 (regular_pay)
 */
@Entity
@Table(name = "regular_pay")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegularPay {

    /** 정기 결제 관리 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "regular_pay_id")
    private Long regularPayId;

    /** 결제한 회원 (FK → user.user_id) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 요청 번호 (aid) */
    @Column(name = "aid", length = 50, nullable = false)
    private String aid;

    /** 결제 번호 (tid) */
    @Column(name = "tid", length = 50, nullable = false)
    private String tid;

    /** 정기 결제용 ID (sid) */
    @Column(name = "sid", length = 50, nullable = false)
    private String sid;

    @Column(name = "is_canceled", nullable = false)
    private boolean canceled;
}
