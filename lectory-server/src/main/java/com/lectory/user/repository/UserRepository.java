package com.lectory.user.repository;

import com.lectory.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 기본적인 findById, save, delete 등은 JpaRepository가 제공합니다.
    // 필요하다면 추가 쿼리 메서드를 여기에 선언하세요.
}