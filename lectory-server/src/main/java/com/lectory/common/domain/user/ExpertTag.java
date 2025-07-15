// src/main/java/com/lectory/common/domain/ExpertTag.java
package com.lectory.common.domain.user;

import com.lectory.common.domain.Tag;
import jakarta.persistence.*;
import lombok.*;

/**
 * 전문가 ↔ 태그 N:M 매핑 테이블 (expert_tag)
 */
@Entity
@Table(name = "expert_tag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertTag {

    /** 복합키 (expert_id + tag_id) */
    @EmbeddedId
    private ExpertTagId id;

    /** 연관된 전문가 */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("expertId")
    @JoinColumn(name = "expert_id", nullable = false)
    private Expert expert;

    /** 연관된 태그 */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("tagId")
    @JoinColumn(name = "tag_id", nullable = false)
    private Tag tag;
}
