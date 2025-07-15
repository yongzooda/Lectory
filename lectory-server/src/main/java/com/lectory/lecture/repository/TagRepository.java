// TagRepository.java
package com.lectory.lecture.repository;

import com.lectory.common.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * 이름으로 태그 조회
     */
    Optional<Tag> findByName(String name);

    /**
     * 이름으로 시작하는 태그 목록 조회
     */
    List<Tag> findByNameStartingWith(String prefix);
}
