// src/main/java/com/lectory/contentlibrary/repository/LectureTagRepository.java
package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.LectureTag;
import com.lectory.common.domain.lecture.LectureTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 챕터(강의) ↔ 태그 매핑 레포지토리 */
public interface LectureTagRepository
        extends JpaRepository<LectureTag, LectureTagId> {

    /* 1) 챕터 ID 기준 태그 전체 삭제 */
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM LectureTag lt WHERE lt.lectureId = :lectureId")
    void deleteAllByLectureId(@Param("lectureId") Long lectureId);

    /* 2) 챕터 ID 기준 태그 조회 */
    List<LectureTag> findByLectureId(Long lectureId);

    /* 3) 여러 챕터의 태그를 한꺼번에 삭제  */
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM LectureTag lt WHERE lt.lectureId IN :lectureIds")
    void deleteAllByLectureIds(@Param("lectureIds") List<Long> lectureIds);
}
