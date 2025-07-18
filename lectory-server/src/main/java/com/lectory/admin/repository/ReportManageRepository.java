package com.lectory.admin.repository;

import com.lectory.common.domain.Report;
import com.lectory.common.domain.ReportTarget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportManageRepository extends JpaRepository<Report, Long> {
    boolean existsByTargetAndTargetId(ReportTarget target, Long targetId);
}
