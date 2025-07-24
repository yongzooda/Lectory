// MembershipRepository.java
package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    /**
     * 특정 회원이 특정 강의실을 수강 중인지 조회
     */
    Optional<Membership> findByUserIdAndLectureRoomId(Long userId, Long lectureRoomId);

    /**
     * 특정 회원의 모든 수강 정보 조회
     */
    List<Membership> findByUserId(Long userId);

    /**
     * 특정 강의실을 수강 중인 모든 회원 조회
     */
    List<Membership> findByLectureRoomId(Long lectureRoomId);

    /* 🚩 강의실-ID 로 수강신청 전부 삭제 ── FK 해제 핵심 */
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("""
        DELETE FROM Membership m
         WHERE m.lectureRoomId = :roomId
    """)
    int deleteByLectureRoomId(@Param("roomId") Long roomId);
}
