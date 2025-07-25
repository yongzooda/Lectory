package com.lectory.contentlibrary.repository;

import com.lectory.common.domain.lecture.LectureRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LectureRoomRepository extends JpaRepository<LectureRoom, Long> {

    // ─── 0) 단건 조회 ─────────────────────────────────────────────
    Optional<LectureRoom> findByLectureRoomId(Long lectureRoomId);

    // ─── 1) 전체 목록 ─────────────────────────────────────────────
    /** 1‑a) 기본: pageable.sort(createdAt DESC / title ASC) */
    Page<LectureRoom> findAll(Pageable pageable);

    /** 1‑b) 수강자순 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      ORDER BY (
        SELECT COUNT(m)
        FROM Membership m
        WHERE m.lectureRoomId = lr.lectureRoomId
      ) DESC
    """)
    Page<LectureRoom> findAllByPopularity(Pageable pageable);

    // ─── 2) 키워드(제목·전문가명) 검색 ────────────────────────────

    /** 2‑a) 기본 정렬 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      JOIN e.user u
      WHERE LOWER(lr.title)   LIKE LOWER(CONCAT('%', :kw, '%'))
         OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
    """)
    Page<LectureRoom> findByKeyword(@Param("kw") String keyword, Pageable pageable);

    /** 2‑b) 수강자순 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      JOIN e.user u
      WHERE LOWER(lr.title)   LIKE LOWER(CONCAT('%', :kw, '%'))
         OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
      ORDER BY (
        SELECT COUNT(m)
        FROM Membership m
        WHERE m.lectureRoomId = lr.lectureRoomId
      ) DESC
    """)
    Page<LectureRoom> findByKeywordByPopularity(@Param("kw") String keyword, Pageable pageable);

    // ─── 3) 태그 검색 ─────────────────────────────────────────────

    /** 3‑a) 기본 정렬 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      WHERE EXISTS (
        SELECT 1
        FROM Lecture lec
        JOIN LectureTag lt ON lt.lectureId = lec.lectureId
        JOIN Tag t ON t.tagId = lt.tagId
        WHERE lec.lectureRoom = lr
          AND t.name IN :tags
      )
    """)
    Page<LectureRoom> findByTags(@Param("tags") List<String> tags, Pageable pageable);

    /** 3‑b) 수강자순 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      WHERE EXISTS (
        SELECT 1
        FROM Lecture lec
        JOIN LectureTag lt ON lt.lectureId = lec.lectureId
        JOIN Tag t ON t.tagId = lt.tagId
        WHERE lec.lectureRoom = lr
          AND t.name IN :tags
      )
      ORDER BY (
        SELECT COUNT(m)
        FROM Membership m
        WHERE m.lectureRoomId = lr.lectureRoomId
      ) DESC
    """)
    Page<LectureRoom> findByTagsByPopularity(@Param("tags") List<String> tags, Pageable pageable);

    // ─── 4) 키워드 + 태그 검색 ────────────────────────────────────

    /** 4‑a) 기본 정렬 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      JOIN e.user u
      WHERE EXISTS (
        SELECT 1
        FROM Lecture lec
        JOIN LectureTag lt ON lt.lectureId = lec.lectureId
        JOIN Tag t ON t.tagId = lt.tagId
        WHERE lec.lectureRoom = lr
          AND t.name IN :tags
      )
      AND (
        LOWER(lr.title)   LIKE LOWER(CONCAT('%', :kw, '%'))
        OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
      )
    """)
    Page<LectureRoom> findByKeywordAndTags(@Param("kw") String keyword,
                                           @Param("tags") List<String> tags,
                                           Pageable pageable);

    /** 4‑b) 수강자순 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      JOIN e.user u
      WHERE EXISTS (
        SELECT 1
        FROM Lecture lec
        JOIN LectureTag lt ON lt.lectureId = lec.lectureId
        JOIN Tag t ON t.tagId = lt.tagId
        WHERE lec.lectureRoom = lr
          AND t.name IN :tags
      )
      AND (
        LOWER(lr.title)   LIKE LOWER(CONCAT('%', :kw, '%'))
        OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
      )
      ORDER BY (
        SELECT COUNT(m)
        FROM Membership m
        WHERE m.lectureRoomId = lr.lectureRoomId
      ) DESC
    """)
    Page<LectureRoom> findByKeywordAndTagsByPopularity(@Param("kw") String keyword,
                                                       @Param("tags") List<String> tags,
                                                       Pageable pageable);

    // ─── 5) 전문가 전용 목록 ───────────────────────────────────────

    Page<LectureRoom> findByExpert_ExpertId(Long expertId, Pageable pageable);

    @Query("""
      SELECT lr
      FROM LectureRoom lr
      WHERE lr.expert.expertId = :expertId
      ORDER BY (
        SELECT COUNT(m)
        FROM Membership m
        WHERE m.lectureRoomId = lr.lectureRoomId
      ) DESC
    """)
    Page<LectureRoom> findByExpert_ExpertIdByPopularity(@Param("expertId") Long expertId,
                                                        Pageable pageable);

    // ─── 6) 전문가 전용 검색 (키워드·태그) ─────────────────────────

    /** 6‑a) 키워드만 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      JOIN e.user u
      WHERE e.expertId = :expertId
        AND (
          LOWER(lr.title) LIKE LOWER(CONCAT('%', :kw, '%'))
          OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
        )
    """)
    Page<LectureRoom> findByExpertAndKeyword(@Param("expertId") Long expertId,
                                             @Param("kw") String keyword,
                                             Pageable pageable);

    /** 6‑b) 태그만 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      WHERE e.expertId = :expertId
        AND EXISTS (
          SELECT 1
          FROM Lecture lec
          JOIN LectureTag lt ON lt.lectureId = lec.lectureId
          JOIN Tag t ON t.tagId = lt.tagId
          WHERE lec.lectureRoom = lr
            AND t.name IN :tags
        )
    """)
    Page<LectureRoom> findByExpertAndTags(@Param("expertId") Long expertId,
                                          @Param("tags") List<String> tags,
                                          Pageable pageable);

    /** 6‑c) 키워드 + 태그 */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      JOIN e.user u
      WHERE e.expertId = :expertId
        AND EXISTS (
          SELECT 1
          FROM Lecture lec
          JOIN LectureTag lt ON lt.lectureId = lec.lectureId
          JOIN Tag t ON t.tagId = lt.tagId
          WHERE lec.lectureRoom = lr
            AND t.name IN :tags
        )
        AND (
          LOWER(lr.title) LIKE LOWER(CONCAT('%', :kw, '%'))
          OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
        )
    """)
    Page<LectureRoom> findByExpertAndKeywordAndTags(@Param("expertId") Long expertId,
                                                    @Param("kw") String keyword,
                                                    @Param("tags") List<String> tags,
                                                    Pageable pageable);

    /** 6‑d) 키워드 + 태그 (인기순) */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      JOIN e.user u
      WHERE e.expertId = :expertId
        AND EXISTS (
          SELECT 1
          FROM Lecture lec
          JOIN LectureTag lt ON lt.lectureId = lec.lectureId
          JOIN Tag t ON t.tagId = lt.tagId
          WHERE lec.lectureRoom = lr
            AND t.name IN :tags
        )
        AND (
          LOWER(lr.title) LIKE LOWER(CONCAT('%', :kw, '%'))
          OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
        )
      ORDER BY (
        SELECT COUNT(m)
        FROM Membership m
        WHERE m.lectureRoomId = lr.lectureRoomId
      ) DESC
    """)
    Page<LectureRoom> findByExpertAndKeywordAndTagsByPopularity(@Param("expertId") Long expertId,
                                                                @Param("kw") String keyword,
                                                                @Param("tags") List<String> tags,
                                                                Pageable pageable);

    /** 6‑e) 키워드만 (인기순) */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      JOIN e.user u
      WHERE e.expertId = :expertId
        AND (
          LOWER(lr.title) LIKE LOWER(CONCAT('%', :kw, '%'))
          OR LOWER(u.nickname) LIKE LOWER(CONCAT('%', :kw, '%'))
        )
      ORDER BY (
        SELECT COUNT(m)
        FROM Membership m
        WHERE m.lectureRoomId = lr.lectureRoomId
      ) DESC
    """)
    Page<LectureRoom> findByExpertAndKeywordByPopularity(@Param("expertId") Long expertId,
                                                         @Param("kw") String keyword,
                                                         Pageable pageable);

    /** 6‑f) 태그만 (인기순) */
    @Query("""
      SELECT lr
      FROM LectureRoom lr
      JOIN lr.expert e
      WHERE e.expertId = :expertId
        AND EXISTS (
          SELECT 1
          FROM Lecture lec
          JOIN LectureTag lt ON lt.lectureId = lec.lectureId
          JOIN Tag t ON t.tagId = lt.tagId
          WHERE lec.lectureRoom = lr
            AND t.name IN :tags
        )
      ORDER BY (
        SELECT COUNT(m)
        FROM Membership m
        WHERE m.lectureRoomId = lr.lectureRoomId
      ) DESC
    """)
    Page<LectureRoom> findByExpertAndTagsByPopularity(@Param("expertId") Long expertId,
                                                      @Param("tags") List<String> tags,
                                                      Pageable pageable);
}
