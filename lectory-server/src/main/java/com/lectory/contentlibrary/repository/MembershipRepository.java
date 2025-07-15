// MembershipRepository.java
package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
