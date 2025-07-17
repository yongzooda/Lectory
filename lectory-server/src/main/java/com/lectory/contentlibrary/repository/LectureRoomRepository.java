package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.LectureRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 강의실(LectureRoom) 조회 전용 Repository
 *
 * ────────────────────────── 태그 관련 쿼리 설계 참고 ──────────────────────────
 * • Lecture ― LectureTag(조인 테이블) ― Tag  3단계 구조.
 * • Lecture 엔티티에 tags 필드가 없으므로 JPQL JOIN ON 또는 EXISTS 서브쿼리 사용.
 * ---------------------------------------------------------------------------*/
@Repository
public interface LectureRoomRepository extends JpaRepository<LectureRoom, Long> {

    /* ───────────────── 기본 메서드 ───────────────── */
    Optional<LectureRoom> findByLectureRoomId(Long lectureRoomId);

    Page<LectureRoom> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    /* 인기순(수강생 수 DESC) */
    @Query("""
SELECT lr
FROM   LectureRoom lr
ORDER  BY (
  SELECT COUNT(m)
  FROM   Membership m
  WHERE  m.lectureRoomId = lr.lectureRoomId
) DESC
""")
    Page<LectureRoom> findAllOrderByEnrollmentCountDesc(Pageable pageable);

    /* ─────────────── 전문가 전용 목록/검색 ─────────────── */
    Page<LectureRoom> findByExpertUserUserId(Long userId, Pageable pageable);

    Page<LectureRoom> findByExpertUserUserIdAndTitleContainingIgnoreCase(
            Long userId, String keyword, Pageable pageable);

    /** ① 전문가 + 태그 필터 */
    @Query("""
SELECT lr
FROM   LectureRoom lr
WHERE  lr.expert.user.userId = :expertId
AND    EXISTS (
  SELECT 1
  FROM   Lecture         lec
         JOIN LectureTag lt ON lt.lectureId = lec.lectureId
         JOIN Tag        t  ON t.tagId      = lt.tagId
  WHERE  lec.lectureRoom = lr
  AND    t.name          IN :tags
)
""")
    Page<LectureRoom> findByExpertAndLectureTagNames(
            @Param("expertId") Long expertId,
            @Param("tags")     List<String> tags,
            Pageable pageable);

    /* ─────────────── 전체 검색/필터 ─────────────── */

    /** ② 전체 + 태그 필터 */
    @Query("""
SELECT lr
FROM   LectureRoom lr
WHERE  EXISTS (
  SELECT 1
  FROM   Lecture         lec
         JOIN LectureTag lt ON lt.lectureId = lec.lectureId
         JOIN Tag        t  ON t.tagId      = lt.tagId
  WHERE  lec.lectureRoom = lr
  AND    t.name          IN :tags
)
""")
    Page<LectureRoom> findByLectureTagNames(
            @Param("tags") List<String> tags,
            Pageable pageable);

    /** ③ 키워드 + 태그 AND 조건 (수강생 화면) */
    @Query("""
SELECT lr
FROM   LectureRoom lr
       JOIN lr.expert e
       JOIN e.user    u
WHERE  EXISTS (
  SELECT 1
  FROM   Lecture         lec
         JOIN LectureTag lt ON lt.lectureId = lec.lectureId
         JOIN Tag        t  ON t.tagId      = lt.tagId
  WHERE  lec.lectureRoom = lr
  AND    t.name          IN :tags
)
AND   (
       LOWER(lr.title)   LIKE LOWER(CONCAT('%', :kw, '%'))
    OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
)
""")
    Page<LectureRoom> searchByKeywordAndLectureTagNames(
            @Param("kw")   String keyword,
            @Param("tags") List<String> tags,
            Pageable pageable);

    /** ③-B 키워드만 (태그 조건 없음) */
    @Query("""
SELECT lr
FROM   LectureRoom lr
       JOIN lr.expert e
       JOIN e.user    u
WHERE  LOWER(lr.title)   LIKE LOWER(CONCAT('%', :kw, '%'))
   OR  LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
""")
    Page<LectureRoom> searchByKeywordOnly(@Param("kw") String keyword,
                                          Pageable pageable);

    /** ④ 전문가 + 키워드 + 태그 AND 조건 */
    @Query("""
SELECT lr
FROM   LectureRoom lr
       JOIN lr.expert e
       JOIN e.user    u
WHERE  lr.expert.user.userId = :expertId
AND    EXISTS (
  SELECT 1
  FROM   Lecture         lec
         JOIN LectureTag lt ON lt.lectureId = lec.lectureId
         JOIN Tag        t  ON t.tagId      = lt.tagId
  WHERE  lec.lectureRoom = lr
  AND    t.name          IN :tags
)
AND (
       LOWER(lr.title)   LIKE LOWER(CONCAT('%', :kw, '%'))
    OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
)
""")
    Page<LectureRoom> searchByExpertAndTagAndKeyword(
            @Param("expertId") Long expertId,
            @Param("kw")       String keyword,
            @Param("tags")     List<String> tags,
            Pageable pageable);
}
