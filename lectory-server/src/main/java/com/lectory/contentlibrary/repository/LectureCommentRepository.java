// LectureCommentRepository.java
package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.LectureComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface LectureCommentRepository extends JpaRepository<LectureComment, Long> {

    /**
     * 특정 강의실의 댓글을 모두 조회
     */
    List<LectureComment> findAllByLectureRoomId(Long lectureRoomId);

    /* 강의실-ID로 모든 댓글 bulk 삭제 */
    @Modifying
    @Transactional
    @Query("""
        DELETE FROM LectureComment c
         WHERE c.lectureRoomId = :roomId
    """)
    void deleteByLectureRoomId(@Param("roomId") Long roomId);
}
