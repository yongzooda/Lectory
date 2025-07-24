// File: com/lectory/contentlibrary/repository/LectureRepository.java
package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.Lecture;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {

    /** 1) 강의실에 속한 챕터(강의) 목록 (order_num ASC) */
    List<Lecture> findByLectureRoom_LectureRoomIdOrderByOrderNumAsc(Long lectureRoomId);

    /* ─────────────────────────────────────────────────────────────
     * 2) 강의실 카드 뱃지·필터용 ― 중복 없이 태그 이름 조회
     *      Tag         ← PK tag_id
     *      LectureTag  ← FK (lecture_id, tag_id)
     *      Lecture     ← PK lecture_id
     * ----------------------------------------------------------- */
    @Query("""
        SELECT DISTINCT t.name
          FROM Tag         t
          JOIN LectureTag  lt  ON lt.tagId    = t.tagId
          JOIN Lecture     l   ON l.lectureId = lt.lectureId
         WHERE l.lectureRoom.lectureRoomId = :roomId
    """)
    List<String> findDistinctTagNamesByRoomId(@Param("roomId") Long roomId);

// 3) 챕터별 태그 조회 메서드
    @Query("""
  SELECT t.name
  FROM Tag t
  JOIN LectureTag lt ON lt.tagId = t.tagId
  WHERE lt.lectureId = :lectureId
""")
    List<String> findTagNamesByLectureId(@Param("lectureId") Long lectureId);


    /** 4) 강의실에 속한 챕터 **ID 목록만** 조회 (bulk-delete 전용) */
    @Query("""
        SELECT l.lectureId
          FROM Lecture l
         WHERE l.lectureRoom.lectureRoomId = :roomId
    """)
    List<Long> findIdsByLectureRoom(@Param("roomId") Long roomId);

    /** 5) 강의실에 속한 챕터를 한꺼번에 삭제 */
    @Modifying
    @Transactional          // bulk 쿼리라 트랜잭션 필수
    @Query("""
        DELETE FROM Lecture l
         WHERE l.lectureRoom.lectureRoomId = :roomId
    """)
    void deleteByLectureRoom(@Param("roomId") Long roomId);
}
