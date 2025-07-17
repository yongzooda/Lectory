// File: com/lectory/contentlibrary/repository/LectureRepository.java
package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.Lecture;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}
