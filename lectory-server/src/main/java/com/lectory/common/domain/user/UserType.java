package com.lectory.common.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 회원 권한 (user_type) 엔티티
 */
@Entity
@Table(name = "user_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserType {

    /** 권한 코드 (FREE, PAID, EXPERT, ADMIN) */
    @Id
    @Column(name = "user_type", length = 20)
    private String userType;

    /** 사용자 권한 이름 (무료 회원, 유료 회원, 전문가, 관리자) */
    @Column(name = "type_name", length = 50, nullable = false)
    private String typeName;
}

