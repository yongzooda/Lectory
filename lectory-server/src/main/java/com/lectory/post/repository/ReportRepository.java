package com.lectory.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.Report;
import com.lectory.common.domain.ReportTarget;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {
    boolean existsByTargetAndTargetIdAndUser_UserId(ReportTarget target, Long targetId, Long userId);


    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END " +
            "FROM Report r " +
            "WHERE r.target = :target AND r.targetId = :targetId")
    boolean existsReportAgainstUser(@Param("target") ReportTarget target, @Param("targetId") Long targetId);
}

