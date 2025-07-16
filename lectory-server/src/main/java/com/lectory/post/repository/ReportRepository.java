package com.lectory.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.Report;
import com.lectory.common.domain.ReportTarget;

public interface ReportRepository extends JpaRepository<Report, Long> {
    boolean existsByTargetAndTargetIdAndUser_UserId(ReportTarget target, Long targetId, Long userId);
}
