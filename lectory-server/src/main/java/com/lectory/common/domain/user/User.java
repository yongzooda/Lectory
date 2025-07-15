// User.java
package com.lectory.common.domain.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /** 회원 고유 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    /** 이메일 */
    @Column(length = 100, nullable = false, unique = true)
    private String email;

    /** 암호화된 비밀번호 */
    @Column(length = 255, nullable = false)
    private String password;

    /** 사용자 닉네임 */
    @Column(length = 50, nullable = false)
    private String nickname;

    /** 사용자 권한(구독 등급 or 전문가/Admin) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_type", nullable = false)
    private UserType userType;

    /** 소프트 삭제 여부 */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    /** 가입 일시 */
    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /** 탈퇴(삭제) 일시 */
    @Column
    private LocalDateTime deletedAt;

    /** 유료 구독 시작 일시 */
    @Column
    private LocalDateTime subscriptionStartDate;

    /** 유료 구독 종료 일시 */
    @Column
    private LocalDateTime subscriptionEndDate;

    /** 전문가 프로필(1:1) */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Expert expert;
}
