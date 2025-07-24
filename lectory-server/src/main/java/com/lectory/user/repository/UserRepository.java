package com.lectory.user.repository;

import com.lectory.common.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    // 전체 수강생 조회
    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND u.userType.userType IN ('FREE', 'PAID')")
    List<User> findAllStudents();

    // 특정 권한 수강생 조회 (FREE / PAID)
    @Query("SELECT u FROM User u WHERE u.isDeleted = false AND u.userType.userType = :userType")
    List<User> findStudentsByType(@Param("userType") String userType);
}