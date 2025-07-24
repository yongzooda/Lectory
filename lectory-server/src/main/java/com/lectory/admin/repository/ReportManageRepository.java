package com.lectory.admin.repository;

import com.lectory.common.domain.Report;
import com.lectory.common.domain.ReportStatus;
import com.lectory.common.domain.ReportTarget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportManageRepository extends JpaRepository<Report, Long> {
    // 신고 여부 계산용
    boolean existsByTargetAndTargetId(ReportTarget target, Long targetId);

    List<Report> findByTargetAndTargetIdAndStatus(ReportTarget target, Long targetId, ReportStatus status);
}
