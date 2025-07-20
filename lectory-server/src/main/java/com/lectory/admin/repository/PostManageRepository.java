package com.lectory.admin.repository;

import com.lectory.common.domain.post.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostManageRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p JOIN FETCH p.userId u  WHERE u.isDeleted = false")
    List<Post> findAllWithUser();
}