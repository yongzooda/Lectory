package com.lectory.post.service;

import org.springframework.stereotype.Service;

import com.lectory.common.domain.Report;
import com.lectory.common.domain.ReportStatus;
import com.lectory.common.domain.ReportTarget;
import com.lectory.common.domain.user.User;
import com.lectory.post.repository.ReportRepository;
import com.lectory.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

 private final ReportRepository reportRepository;
 private final UserRepository userRepository;

 @Transactional
 public void create(ReportTarget target, Long targetId, Long userId, String content) {
     if (reportRepository.existsByTargetAndTargetIdAndUser_UserId(target, targetId, userId)) {
         throw new RuntimeException("이미 신고한 대상입니다.");
     }

     User user = userRepository.findById(userId)
             .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

     Report report = Report.builder()
             .target(target)
             .targetId(targetId)
             .user(user)
             .content(content)
             .status(ReportStatus.PENDING)
             .build();

     reportRepository.save(report);
 }
}
