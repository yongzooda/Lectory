package com.lectory.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.post.PostTag;
import com.lectory.common.domain.post.PostTagId;

public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
}