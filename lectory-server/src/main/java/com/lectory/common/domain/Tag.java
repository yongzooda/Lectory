// Tag.java
package com.lectory.common.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tag")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    /** 태그 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagId;

    /** 태그 이름 */
    @Column(nullable = false, unique = true)
    private String name;
}
