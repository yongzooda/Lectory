package com.lectory.post.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.post.PostTag;
import com.lectory.common.domain.post.PostTagId;

public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
    Optional<PostTag> findByName(String name);
}