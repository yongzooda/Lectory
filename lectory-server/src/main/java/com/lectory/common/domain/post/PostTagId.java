package com.lectory.common.domain.post;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Composite PK for post_tag (post_id + tag_id)
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PostTagId implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 게시글 ID */
    @Column(name = "post_id")
    private Long postId;

    /** 태그 ID */
    @Column(name = "tag_id")
    private Long tagId;
}
