// LectureComment.java
package com.lectory.lecture.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lecture_comment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lectureCommentId;

    /** 댓글 작성자(회원) ID */
    @Column(nullable = false)
    private Long userId;

    /** 댓글 대상 강의실 ID */
    @Column(nullable = false)
    private Long lectureRoomId;

    /** 댓글 내용 */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /** 작성 일시 */
    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
