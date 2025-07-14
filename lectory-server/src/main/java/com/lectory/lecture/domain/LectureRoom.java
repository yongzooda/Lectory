// LectureRoom.java
package com.lectory.lecture.domain;

import com.lectory.user.domain.Expert;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "lecture_room")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lectureRoomId;

    /** 강의실 제목 */
    @Column(nullable = false)
    private String title;

    /** 강의실 소개글 */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** 대표 이미지 URL */
    @Column
    private String coverImageUrl;

    /** 자료 파일 URL */
    @Column
    private String fileUrl;

    /** 유료 강의실 여부 */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isPaid = false;

    /** 개설 전문가 (user→expert) */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "expert_id", nullable = false)
    private Expert expert;

    /** 챕터 목록 */
    @OneToMany(mappedBy = "lectureRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lecture> lectures;

    /** 생성 일시 */
    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /** 수정 일시 */
    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
