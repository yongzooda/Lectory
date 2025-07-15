package com.lectory.common.domain.post;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.lectory.common.domain.Tag;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriberType subscriberType = SubscriberType.FREE;

    @Column(nullable = false)
    private Integer likeCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
            name = "post_tag",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();
}
