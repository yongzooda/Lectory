// src/main/java/com/lectory/common/domain/ExpertTagId.java
package com.lectory.common.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.*;

/**
 * 복합 PK: expert_id + tag_id
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ExpertTagId implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 전문가 ID (FK → expert.id) */
    @Column(name = "expert_id")
    private Long expertId;

    /** 태그 ID (FK → tag.id) */
    @Column(name = "tag_id")
    private Long tagId;
}
