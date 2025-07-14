// LectureCommentRepository.java
package com.lectory.lecture.repository;

import com.lectory.lecture.domain.LectureComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LectureCommentRepository extends JpaRepository<LectureComment, Long> {
}
