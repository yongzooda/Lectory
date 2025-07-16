package com.lectory.contentlibrary.student.service;

import com.lectory.common.domain.lecture.LectureRoom;
import com.lectory.common.domain.user.User;
import com.lectory.contentlibrary.dto.*;
import com.lectory.common.domain.lecture.LectureComment;
import com.lectory.common.domain.lecture.Membership;
import com.lectory.contentlibrary.repository.LectureCommentRepository;
import com.lectory.contentlibrary.repository.LectureRepository;
import com.lectory.contentlibrary.repository.LectureRoomRepository;
import com.lectory.contentlibrary.repository.MembershipRepository;
import com.lectory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentLibraryService {
    private final LectureRoomRepository lectureRoomRepo;
    private final LectureRepository lectureRepo;
    private final MembershipRepository membershipRepo;
    private final LectureCommentRepository commentRepo;
    private final UserRepository userRepo;

    private static final DateTimeFormatter ISO_FMT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    /** 1) 목록 조회 (생성일 순 or 인기순) */
    public PageDto<LectureRoomSummaryDto> listLectureRooms(
            Long memberId, int page, int size, String sort
    ) {
        Pageable pageable = toPageable(page, size, sort);
        boolean popularity = pageable.getSort()
                .stream()
                .anyMatch(o -> o.getProperty().equals("popularity"));

        Page<LectureRoom> rooms = popularity
                ? lectureRoomRepo.findAllOrderByEnrollmentCountDesc(pageable)
                : lectureRoomRepo.findAll(pageable);

        Page<LectureRoomSummaryDto> dtos = rooms.map(r -> toSummary(r, memberId));
        return PageDto.of(dtos);
    }

    /** 2) 키워드·태그 검색 */
    public PageDto<LectureRoomSummaryDto> searchLectureRooms(
            Long memberId,
            String keyword,
            List<String> tags,
            int page,
            int size,
            String sort
    ) {
        Pageable pageable = toPageable(page, size, sort);
        Page<LectureRoom> rooms;

        if (tags != null && !tags.isEmpty()) {
            // 태그 검색 우선
            rooms = lectureRoomRepo.findByLectureTagNames(tags, pageable);
        } else {
            // 기존 제목(키워드) 검색
            rooms = lectureRoomRepo.findByTitleContainingIgnoreCase(keyword, pageable);
        }

        Page<LectureRoomSummaryDto> dtos = rooms
                .map(r -> toSummary(r, memberId));

        return PageDto.of(dtos);
    }

    /** 3) 상세 조회 */
    public LectureDetailDto getLectureDetail(Long memberId, Long lectureRoomId) {
        LectureRoom room = lectureRoomRepo
                .findByLectureRoomId(lectureRoomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의실: " + lectureRoomId));

        List<ChapterDto> chapters = lectureRepo
                .findByLectureRoom_LectureRoomIdOrderByOrderNumAsc(lectureRoomId)
                .stream()
                .map(l -> new ChapterDto(l.getChapterName(), l.getExpectedTime()))
                .collect(Collectors.toList());

        List<CommentDto> comments = commentRepo
                .findAllByLectureRoomId(lectureRoomId)
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

        return new LectureDetailDto(
                room.getTitle(),
                room.getCoverImageUrl(),
                room.getDescription(),
                chapters,
                comments,
                enrolled,
                room.getIsPaid(),
                !enrolled
        );
    }

    /** 4) 수강신청 */
    public EnrollResponseDto enroll(Long memberId, Long lectureRoomId) {
        membershipRepo.findByUserIdAndLectureRoomId(memberId, lectureRoomId)
                .ifPresent(m -> {
                    throw new IllegalArgumentException("이미 수강신청된 강의입니다.");
                });

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

    /** 5) 댓글 작성 */
    public CommentResponseDto postComment(
            Long memberId, Long lectureRoomId, String content
    ) {
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
                .createdAt(saved.getCreatedAt().toString())
                .success(true)
                .build();
    }

    // ─────── private helpers ───────

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
        int count = membershipRepo
                .findByLectureRoomId(room.getLectureRoomId()).size();

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
}
