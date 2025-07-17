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

    /**
     * 1) 전체 목록 (최신순 / 수강자순 / 제목순)
     */
    public PageDto<LectureRoomSummaryDto> listLectureRooms(
            Long memberId, int page, int size, String sort) {

        boolean byPopularity = sort != null && sort.startsWith("popularity");

        // 인기순이면 Sort 없이, 그 외엔 createdAt 혹은 title 기준 Sort 포함
        Pageable pg = byPopularity
                ? PageRequest.of(page, size)
                : toPageable(page, size, sort);

        Page<LectureRoom> rooms = byPopularity
                ? lectureRoomRepo.findAllByPopularity(pg)
                : lectureRoomRepo.findAll(pg);

        return PageDto.of(rooms.map(r -> toSummary(r, memberId)));
    }

    /**
     * 2) 키워드·태그 검색 (최신순 / 수강자순 / 제목순)
     */
    public PageDto<LectureRoomSummaryDto> searchLectureRooms(
            Long memberId,
            String keyword,
            List<String> tags,
            int page, int size,
            String sort) {

        boolean byPopularity = sort != null && sort.startsWith("popularity");
        boolean hasTags = tags != null && !tags.isEmpty();
        boolean hasKw   = keyword != null && !keyword.isBlank();

        // 인기순이면 Sort 없이, 그 외엔 createdAt 혹은 title 기준 Sort 포함
        Pageable pg = byPopularity
                ? PageRequest.of(page, size)
                : toPageable(page, size, sort);

        Page<LectureRoom> rooms;

        if (hasTags && hasKw) {
            // 키워드 + 태그
            rooms = byPopularity
                    ? lectureRoomRepo.findByKeywordAndTagsByPopularity(keyword, tags, pg)
                    : lectureRoomRepo.findByKeywordAndTags(keyword, tags, pg);

        } else if (hasTags) {
            // 태그만
            rooms = byPopularity
                    ? lectureRoomRepo.findByTagsByPopularity(tags, pg)
                    : lectureRoomRepo.findByTags(tags, pg);

        } else if (hasKw) {
            // 키워드만
            rooms = byPopularity
                    ? lectureRoomRepo.findByKeywordByPopularity(keyword, pg)
                    : lectureRoomRepo.findByKeyword(keyword, pg);

        } else {
            // 조건 없음
            rooms = byPopularity
                    ? lectureRoomRepo.findAllByPopularity(pg)
                    : lectureRoomRepo.findAll(pg);
        }

        return PageDto.of(rooms.map(r -> toSummary(r, memberId)));
    }

    /**
     * 3) 상세 조회
     */
    public LectureDetailDto getLectureDetail(Long memberId, Long lectureRoomId) {
        LectureRoom room = lectureRoomRepo.findByLectureRoomId(lectureRoomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의실: " + lectureRoomId));

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

        int enrolledCnt = membershipRepo.findByLectureRoomId(lectureRoomId).size();

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

    /**
     * Pageable 생성 유틸: sort 파라미터를 "필드,방향" 으로 파싱
     * (예: "createdAt,desc", "title,asc")
     */
    private Pageable toPageable(int page, int size, String sort) {
        Sort s;
        if (sort != null && sort.contains(",")) {
            String[] arr = sort.split(",", 2);
            s = Sort.by(Sort.Direction.fromString(arr[1].trim()), arr[0].trim());
        } else if (sort != null && !sort.isEmpty()) {
            s = Sort.by(sort);  // 단일 필드, ASC
        } else {
            s = Sort.by("createdAt").descending();  // 기본 최신순
        }
        return PageRequest.of(page, size, s);
    }

    private LectureRoomSummaryDto toSummary(LectureRoom room, Long memberId) {
        boolean enrolled = membershipRepo
                .findByUserIdAndLectureRoomId(memberId, room.getLectureRoomId())
                .isPresent();
        int count = membershipRepo.findByLectureRoomId(room.getLectureRoomId()).size();
        List<String> tags = lectureRepo.findDistinctTagNamesByRoomId(room.getLectureRoomId());
        return LectureRoomSummaryDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .thumbnail(room.getCoverImageUrl())
                .title(room.getTitle())
                .expertName(room.getExpert().getUser().getNickname())
                .enrollmentCount(count)
                .isPaid(room.getIsPaid())
                .canEnroll(!enrolled)
                .tags(tags)
                .build();
    }

    /* 사용자가 유료 구독자인지 확인하는 도우미
       실제 구현은 결제/구독 테이블을 조회하도록 교체 */
    private boolean userIsPaidSubscriber(Long memberId) {
        // TODO: 구독 정보 확인 로직 (dummy: 항상 false)
        return false;
    }
}
