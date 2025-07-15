package com.lectory.post.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.post.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByIsResolved(boolean isResolved);
    
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    Page<Post> findByOnlyExpertTrueOrderByCreatedAtDesc(Pageable pageable);
}