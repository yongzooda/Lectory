package com.lectory.common.domain.lecture;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

// LectureTagId.java
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class LectureTagId implements Serializable {
    private Long lectureId;
    private Long tagId;
}

