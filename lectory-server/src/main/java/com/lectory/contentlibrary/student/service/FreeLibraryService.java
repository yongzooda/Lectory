package com.lectory.contentlibrary.student.service;

import com.lectory.contentlibrary.dto.EnrollResponseDto;
import com.lectory.common.domain.lecture.LectureRoom;
import com.lectory.common.domain.lecture.Membership;
import com.lectory.contentlibrary.repository.LectureRoomRepository;
import com.lectory.contentlibrary.repository.MembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FreeLibraryService {

    private final LectureRoomRepository lectureRoomRepo;
    private final MembershipRepository membershipRepo;

    /**
     * Free 전용 수강신청: 유료 강의실 신청 불가
     */
    public EnrollResponseDto enroll(Long memberId, Long lectureRoomId) {
        LectureRoom room = lectureRoomRepo.findById(lectureRoomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의실입니다."));
        if (room.getIsPaid()) {
            throw new IllegalArgumentException("무료 구독자는 유료 강의실을 수강신청할 수 없습니다.");
        }
        Membership m = Membership.builder()
                .userId(memberId)
                .lectureRoomId(lectureRoomId)
                .build();
        membershipRepo.save(m);
        return EnrollResponseDto.builder()
                .success(true)
                .message("수강신청이 완료되었습니다.")
                .lectureRoomId(lectureRoomId)
                .isEnrolled(true)
                .build();
    }
}
