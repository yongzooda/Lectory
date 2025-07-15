package com.lectory.post.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lectory.common.domain.post.PostTag;
import com.lectory.common.domain.post.PostTagId;

public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
    
	@Query("select pt from PostTag pt where pt.tag.name = :name")
    List<PostTag> findByTagName(@Param("name") String name);
}