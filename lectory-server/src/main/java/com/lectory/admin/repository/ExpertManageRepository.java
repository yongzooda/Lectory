package com.lectory.admin.repository;

import com.lectory.common.domain.user.Expert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExpertManageRepository extends JpaRepository<Expert, Long> {
    @Query("""
        SELECT e
        FROM Expert e
        JOIN FETCH e.user u
        WHERE u.isDeleted = false
    """)
    List<Expert> findAllActiveExperts();
}
