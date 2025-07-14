// LectureTagRepository.java
package com.lectory.lecture.repository;

import com.lectory.lecture.domain.LectureTag;
import com.lectory.lecture.domain.LectureTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureTagRepository extends JpaRepository<LectureTag, LectureTagId> {
    /**
     * 특정 강의(챕터)에 매핑된 태그 목록 조회
     */
    List<LectureTag> findByLectureId(Long lectureId);

    /**
     * 특정 태그에 매핑된 강의(챕터) 목록 조회
     */
    List<LectureTag> findByTagId(Long tagId);
}
