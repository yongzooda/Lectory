// LectureRepository.java
package com.lectory.lecture.repository;

import com.lectory.common.domain.lecture.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {

    /**
     * 특정 강의실에 속한 챕터(강의) 목록을 순서대로 조회
     */
    List<Lecture> findByLectureRoom_LectureRoomIdOrderByOrderNumAsc(Long lectureRoomId);

}
