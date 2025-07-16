// LectureCommentRepository.java
package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.LectureComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface LectureCommentRepository extends JpaRepository<LectureComment, Long> {

    /**
     * 특정 강의실의 댓글을 모두 조회
     */
    List<LectureComment> findAllByLectureRoomId(Long lectureRoomId);
}
