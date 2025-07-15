package com.lectory.common.domain.comment;

import com.lectory.common.domain.post.Post;
import com.lectory.common.domain.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

/**
 * 댓글 엔티티 (comment)
 */
@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    /** 댓글 고유 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    /** 게시글 ID (FK → post.post_id) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    /** 작성자 ID (FK → user.user_id) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 부모 댓글 (parent_id) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    /** 자식 댓글들 (대댓글) */
    @OneToMany(mappedBy = "parent", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Comment> replies = new ArrayList<>();

    /** 댓글 내용 */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /** 좋아요 수 */
    @Column(name = "like_count", nullable = false, columnDefinition = "INT UNSIGNED DEFAULT 0")
    private Integer likeCount = 0;

    /** 작성일자 */
    @Column(name = "created_at",
            nullable = false,
            updatable = false,
            columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    /** 수정일자 */
    @Column(name = "updated_at",
            nullable = false,
            columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    /** 채택 여부 */
    @Column(name = "is_accepted", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isAccepted = false;

    /** 논리적 삭제 여부 */
    @Column(name = "is_deleted", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isDeleted = false;
}
