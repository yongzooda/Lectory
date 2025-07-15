// LectureRoomRepository.java
package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.LectureRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LectureRoomRepository extends JpaRepository<LectureRoom, Long> {

    /**
     * 특정 lectureRoomId에 해당하는 LectureRoom을 조회
     */
    Optional<LectureRoom> findByLectureRoomId(Long lectureRoomId);

    /**
     * 강의실 제목에 키워드가 포함된 것을 페이지 단위로 조회
     */
    Page<LectureRoom> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    /**
     * 인기순: 수강신청 테이블을 lectureRoomId 기준으로 ON 조인해서 count(m) DESC
     */
    @Query("""
      SELECT lr
        FROM LectureRoom lr
        LEFT JOIN Membership m
          ON m.lectureRoomId = lr.lectureRoomId
       GROUP BY lr
       ORDER BY COUNT(m) DESC
    """)
    Page<LectureRoom> findAllOrderByEnrollmentCountDesc(Pageable pageable);

}
