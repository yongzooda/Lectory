package com.lectory.user.repository;

import com.lectory.common.domain.user.Expert;
import com.lectory.common.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExpertRepository extends JpaRepository<Expert, Long> {
    Optional<Expert> findByUser(User user);
}
