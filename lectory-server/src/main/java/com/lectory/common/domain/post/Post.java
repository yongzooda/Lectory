package com.lectory.common.domain.post;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.lectory.common.domain.user.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User userId;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob
    private String content;

    @Column(nullable = false)
    private boolean onlyExpert = false;

    @Column(nullable = false)
    private boolean isResolved = false;

    @Column(nullable = false)
    private Integer likeCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PostTag> postTags = new HashSet<>();

    public void accept() {
        this.isResolved = true;
    }
}
