package com.lectory.user.repository;

import com.lectory.common.domain.user.Expert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpertRepository extends JpaRepository<Expert, Long> {
}
