// Lecture.java
package com.lectory.common.domain.lecture;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lecture")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lectureId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lecture_room_id", nullable = false)
    private LectureRoom lectureRoom;

    @Column(nullable = false)
    private String chapterName;

    @Column
    private String expectedTime;

    @Column
    private String videoUrl;

    @Column(nullable = false)
    private Integer orderNum;
}
