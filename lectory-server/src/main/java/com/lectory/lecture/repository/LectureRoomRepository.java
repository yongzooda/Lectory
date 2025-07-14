// LectureRoomRepository.java
package com.lectory.lecture.repository;

import com.lectory.lecture.domain.LectureRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LectureRoomRepository extends JpaRepository<LectureRoom, Long> {

    /**
     * 특정 lectureRoomId에 해당하는 LectureRoom을 조회
     */
    Optional<LectureRoom> findByLectureRoomId(Long lectureRoomId);


}
