// LectureTag.java
package com.lectory.common.domain.lecture;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lecture_tag")
@IdClass(LectureTagId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureTag {

    /** 복합키: 강의(챕터) ID */
    @Id
    @Column(name = "lecture_id", nullable = false)
    private Long lectureId;

    /** 복합키: 태그 ID */
    @Id
    @Column(name = "tag_id", nullable = false)
    private Long tagId;
}
