package com.lectory.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.post.PostTag;
import com.lectory.common.domain.post.PostTagId;
import org.springframework.stereotype.Repository;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
    public void deleteByPost_PostId(Long postId);
}