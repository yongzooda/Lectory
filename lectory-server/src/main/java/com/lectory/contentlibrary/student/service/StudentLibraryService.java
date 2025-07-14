package com.lectory.contentlibrary.student.service;

import com.lectory.lecture.dto.LectureRoomSummaryDto;
import com.lectory.lecture.dto.LectureDetailDto;
import com.lectory.lecture.dto.PageDto;
import com.lectory.contentlibrary.student.dto.CommentRequest;
import com.lectory.contentlibrary.student.dto.CommentResponse;
import com.lectory.lecture.domain.LectureComment;
import com.lectory.lecture.domain.Membership;
import com.lectory.contentlibrary.student.dto.EnrollResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentLibraryService {

    private final com.lectory.lecture.service.LectureService lectureService;
    private final com.lectory.lecture.repository.MembershipRepository membershipRepo;
    private final com.lectory.lecture.repository.LectureCommentRepository commentRepo;
    private final com.lectory.user.repository.UserRepository userRepo;

    /**
     * 목록 조회 (Free/Paid 공통)
     */
    public PageDto<LectureRoomSummaryDto> listLectureRooms(
            Long memberId, int page, int size, String sort) {
        Page<LectureRoomSummaryDto> pg =
                lectureService.listLectureRooms(memberId, page, size, sort);
        return PageDto.of(pg);
    }

    /**
     * 검색 (Free/Paid 공통)
     */
    public PageDto<LectureRoomSummaryDto> searchLectureRooms(
            Long memberId,
            String search,
            List<String> tags,
            int page,
            int size,
            String sort) {
        Page<LectureRoomSummaryDto> pg =
                lectureService.searchLectureRooms(memberId, search, tags, page, size, sort);
        return PageDto.of(pg);
    }

    /**
     * 상세 조회 (Free/Paid 공통)
     */
    public LectureDetailDto getLectureDetail(Long memberId, Long lectureRoomId) {
        return lectureService.getLectureDetail(memberId, lectureRoomId);
    }

    /**
     * 댓글 작성 (Free/Paid 공통)
     */
    public CommentResponse postComment(Long memberId,
                                       Long lectureRoomId,
                                       String content) {
        // 수강 여부 확인
        membershipRepo.findByUserIdAndLectureRoomId(memberId, lectureRoomId)
                .orElseThrow(() -> new IllegalArgumentException("수강신청이 필요합니다."));

        // 댓글 저장
        LectureComment comment = LectureComment.builder()
                .userId(memberId)
                .lectureRoomId(lectureRoomId)
                .content(content)
                .build();
        LectureComment saved = commentRepo.save(comment);

        // 작성자 닉네임 조회
        String author = userRepo.findById(memberId)
                .map(u -> u.getNickname())
                .orElse("Unknown");

        return CommentResponse.builder()
                .commentId(saved.getLectureCommentId())
                .author(author)
                .content(saved.getContent())
                .createdAt(saved.getCreatedAt().toString())
                .success(true)
                .build();
    }
}