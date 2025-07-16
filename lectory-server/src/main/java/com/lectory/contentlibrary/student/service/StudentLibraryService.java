// File: com.lectory.contentlibrary.student.service.StudentLibraryService.java
package com.lectory.contentlibrary.student.service;

import com.lectory.common.domain.lecture.*;
import com.lectory.common.domain.user.User;
import com.lectory.contentlibrary.dto.*;
import com.lectory.contentlibrary.repository.*;
import com.lectory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentLibraryService {

    /* ─── Repository 의존성 ─── */
    private final LectureRoomRepository    lectureRoomRepo;
    private final LectureRepository        lectureRepo;
    private final MembershipRepository     membershipRepo;
    private final LectureCommentRepository commentRepo;
    private final UserRepository           userRepo;

    private static final DateTimeFormatter ISO_FMT =
            DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    /* ───────────────────────────────────────────────────────────────
     * 1) 전체 목록 (최신순 / 인기순)
     * ---------------------------------------------------------------- */
    public PageDto<LectureRoomSummaryDto> listLectureRooms(
            Long memberId, int page, int size, String sort) {

        Pageable pageable  = toPageable(page, size, sort);
        boolean byPop      = pageable.getSort().stream()
                .anyMatch(o -> o.getProperty().equals("popularity"));

        Page<LectureRoom> rooms = byPop
                ? lectureRoomRepo.findAllOrderByEnrollmentCountDesc(pageable)
                : lectureRoomRepo.findAll(pageable);

        return PageDto.of(rooms.map(r -> toSummary(r, memberId)));
    }

    /* 2) 키워드·태그 검색 */
    public PageDto<LectureRoomSummaryDto> searchLectureRooms(
            Long memberId, String keyword, List<String> tags,
            int page, int size, String sort) {

        Pageable pageable = toPageable(page, size, sort);
        Page<LectureRoom> rooms = (tags != null && !tags.isEmpty())
                ? lectureRoomRepo.findByLectureTagNames(tags, pageable)
                : lectureRoomRepo.findByTitleContainingIgnoreCase(keyword, pageable);

        return PageDto.of(rooms.map(r -> toSummary(r, memberId)));
    }

    /* 3) 상세 조회 */
    public LectureDetailDto getLectureDetail(Long memberId, Long lectureRoomId) {

        LectureRoom room = lectureRoomRepo.findByLectureRoomId(lectureRoomId)
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 강의실: " + lectureRoomId));

        /* ── 챕터 → DTO ── */
        List<ChapterDto> chapters = lectureRepo
                .findByLectureRoom_LectureRoomIdOrderByOrderNumAsc(lectureRoomId)
                .stream()
                .map(l -> new ChapterDto(
                        l.getLectureId(),
                        l.getChapterName(),
                        l.getExpectedTime(),
                        l.getOrderNum(),
                        l.getVideoUrl()
                ))
                .collect(Collectors.toList());

        /* ── 댓글 → DTO ── */
        List<CommentDto> comments = commentRepo.findAllByLectureRoomId(lectureRoomId)
                .stream()
                .map(c -> {
                    String nick = userRepo.findById(c.getUserId())
                            .map(User::getNickname)
                            .orElse("Unknown");
                    return new CommentDto(
                            c.getLectureCommentId(),
                            nick,
                            c.getContent(),
                            c.getCreatedAt().format(ISO_FMT)
                    );
                })
                .collect(Collectors.toList());

        boolean enrolled = membershipRepo
                .findByUserIdAndLectureRoomId(memberId, lectureRoomId)
                .isPresent();

        int enrolledCnt = membershipRepo
                .findByLectureRoomId(lectureRoomId).size();

        return LectureDetailDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .title(room.getTitle())
                .description(room.getDescription())
                .coverImageUrl(room.getCoverImageUrl())
                .expertName(room.getExpert().getUser().getNickname())
                .createdAt(room.getCreatedAt().format(ISO_FMT))
                .updatedAt(room.getUpdatedAt().format(ISO_FMT))
                .enrollmentCount(enrolledCnt)
                .chapters(chapters)
                .lectureComments(comments)
                .isEnrolled(enrolled)
                .isPaid(room.getIsPaid())
                .canEnroll(!enrolled)
                .build();
    }

    /* 4) 수강신청 (무료·유료 통합) */
    public EnrollResponseDto enroll(Long memberId, Long lectureRoomId) {

        LectureRoom room = lectureRoomRepo.findById(lectureRoomId)
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 강의실입니다."));

        membershipRepo.findByUserIdAndLectureRoomId(memberId, lectureRoomId)
                .ifPresent(m -> { throw new IllegalArgumentException("이미 수강신청된 강의입니다."); });

        /* ── 유료 강의실이면 유료 구독자인지 확인 ── */
        if (room.getIsPaid() && !userIsPaidSubscriber(memberId)) {
            throw new IllegalArgumentException("유료 구독자 전용 강의입니다.");
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

    /* 5) 댓글 작성 */
    public CommentResponseDto postComment(Long memberId, Long lectureRoomId, String content) {

        membershipRepo.findByUserIdAndLectureRoomId(memberId, lectureRoomId)
                .orElseThrow(() -> new IllegalArgumentException("수강신청이 필요합니다."));

        LectureComment c = LectureComment.builder()
                .userId(memberId)
                .lectureRoomId(lectureRoomId)
                .content(content)
                .build();
        LectureComment saved = commentRepo.save(c);

        String nick = userRepo.findById(memberId)
                .map(User::getNickname)
                .orElse("Unknown");

        return CommentResponseDto.builder()
                .commentId(saved.getLectureCommentId())
                .author(nick)
                .content(saved.getContent())
                .createdAt(saved.getCreatedAt().format(ISO_FMT))
                .success(true)
                .build();
    }

    /* ───────────────── private helpers ───────────────── */

    private Pageable toPageable(int page, int size, String sort) {
        Sort s;
        if (sort != null && sort.contains(",")) {
            String[] arr = sort.split(",", 2);
            s = Sort.by(Sort.Direction.fromString(arr[1].trim()), arr[0].trim());
        } else if (sort != null && !sort.isEmpty()) {
            s = Sort.by(sort);
        } else {
            s = Sort.by("createdAt").descending();
        }
        return PageRequest.of(page, size, s);
    }

    private LectureRoomSummaryDto toSummary(LectureRoom room, Long memberId) {

        boolean enrolled = membershipRepo
                .findByUserIdAndLectureRoomId(memberId, room.getLectureRoomId())
                .isPresent();

        int count = membershipRepo.findByLectureRoomId(room.getLectureRoomId()).size();

        String expertNick = room.getExpert().getUser().getNickname();

        return LectureRoomSummaryDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .thumbnail(room.getCoverImageUrl())
                .title(room.getTitle())
                .expertName(expertNick)
                .enrollmentCount(count)
                .isPaid(room.getIsPaid())
                .canEnroll(!enrolled)
                .build();
    }

    /* 사용자가 유료 구독자인지 확인하는 도우미
       실제 구현은 결제/구독 테이블을 조회하도록 교체하세요. */
    private boolean userIsPaidSubscriber(Long memberId) {
        // TODO: 구독 정보 확인 로직 (dummy: 항상 false)
        return false;
    }
}
