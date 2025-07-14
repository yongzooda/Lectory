package com.lectory.contentlibrary.student.service;

import com.lectory.contentlibrary.student.dto.EnrollResponse;
import com.lectory.lecture.domain.LectureRoom;
import com.lectory.lecture.domain.Membership;
import com.lectory.lecture.repository.LectureRoomRepository;
import com.lectory.lecture.repository.MembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaidLibraryService {

    private final LectureRoomRepository lectureRoomRepo;
    private final MembershipRepository membershipRepo;

    /**
     * Paid 전용 수강신청: 모든 강의실 신청 가능
     */
    public EnrollResponse enroll(Long memberId, Long lectureRoomId) {
        lectureRoomRepo.findById(lectureRoomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의실입니다."));
        Membership m = Membership.builder()
                .userId(memberId)
                .lectureRoomId(lectureRoomId)
                .build();
        membershipRepo.save(m);
        return EnrollResponse.builder()
                .success(true)
                .message("수강신청이 완료되었습니다.")
                .lectureRoomId(lectureRoomId)
                .isEnrolled(true)
                .build();
    }
}