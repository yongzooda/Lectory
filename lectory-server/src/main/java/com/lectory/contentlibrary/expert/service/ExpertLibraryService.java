// File: com.lectory.contentlibrary.expert.service.ExpertLibraryService.java
package com.lectory.contentlibrary.expert.service;

import com.lectory.common.domain.lecture.*;
import com.lectory.common.domain.user.Expert;
import com.lectory.common.domain.user.User;
import com.lectory.contentlibrary.dto.*;
import com.lectory.contentlibrary.repository.*;
import com.lectory.user.repository.ExpertRepository;
import com.lectory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpertLibraryService {

    private final LectureRoomRepository    lectureRoomRepo;
    private final LectureRepository        lectureRepo;
    private final LectureCommentRepository commentRepo;
    private final MembershipRepository     membershipRepo;
    private final UserRepository           userRepo;
    private final ExpertRepository         expertRepo;

    private static final DateTimeFormatter ISO_FMT =
            DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    /* ────────────────────────────────────────────────────────────────
     * 1) 내 강의 목록 (전체)
     * ---------------------------------------------------------------- */
    public PageDto<LectureRoomSummaryDto> listMyLectures(
            Long expertId, int page, int size, String sort) {

        Pageable pg = toPageable(page, size, sort);

        return PageDto.of(
                lectureRoomRepo
                        .findByExpertUserUserId(expertId, pg)
                        .map(this::toSummary)
        );
    }

    /* ────────────────────────────────────────────────────────────────
     * 2) 내 강의 검색 (키워드·태그)
     * ---------------------------------------------------------------- */
    public PageDto<LectureRoomSummaryDto> searchMyLectures(
            Long expertId, String keyword, List<String> tags,
            int page, int size, String sort) {

        Pageable pg = toPageable(page, size, sort);

        boolean hasTags    = tags != null && !tags.isEmpty();
        boolean hasKeyword = keyword != null && !keyword.isBlank();

        Page<LectureRoom> rooms;
        if (hasTags && hasKeyword) {                              // 태그 + 키워드
            rooms = lectureRoomRepo.searchByExpertAndTagAndKeyword(
                    expertId, keyword, tags, pg);
        } else if (hasTags) {                                     // 태그만
            rooms = lectureRoomRepo.findByExpertAndLectureTagNames(
                    expertId, tags, pg);
        } else {                                                  // 키워드만
            rooms = lectureRoomRepo
                    .findByExpertUserUserIdAndTitleContainingIgnoreCase(
                            expertId, keyword, pg);
        }

        return PageDto.of(rooms.map(this::toSummary));
    }

    /* ────────────────────────────────────────────────────────────────
     * 3) 강의실 상세 (전문가)
     * ---------------------------------------------------------------- */
    public LectureDetailDto getLectureDetailForExpert(Long lectureRoomId, Long expertId) {

        LectureRoom room = fetchOwnedRoom(expertId, lectureRoomId);

        /* 챕터 목록 → DTO */
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
                .toList();

        /* 댓글 + 수강생 수 */
        List<CommentDto> comments = listComments(lectureRoomId);
        int enrolledCnt = membershipRepo.findByLectureRoomId(lectureRoomId).size();

        return LectureDetailDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .title(room.getTitle())
                .description(room.getDescription())
                .coverImageUrl(room.getCoverImageUrl())
                .isPaid(room.getIsPaid())
                .expertName(room.getExpert().getUser().getNickname())
                .createdAt(room.getCreatedAt().format(ISO_FMT))
                .updatedAt(room.getUpdatedAt().format(ISO_FMT))
                .enrollmentCount(enrolledCnt)
                .chapters(chapters)
                .lectureComments(comments)
                .isEnrolled(true)       // 전문가 본인은 항상 수강 상태
                .build();
    }

    /* ────────────────────────────────────────────────────────────────
     * 4) 강의실 신규 생성
     * ---------------------------------------------------------------- */
    public Long createLecture(LectureCreateRequestDto req) {

        Expert expert = expertRepo.findById(req.getExpertId())
                .orElseThrow(() -> new IllegalArgumentException("전문가 계정을 찾을 수 없습니다."));

        LectureRoom room = LectureRoom.builder()
                .expert(expert)
                .coverImageUrl(req.getThumbnail())
                .title(req.getTitle())
                .description(req.getDescription())
                .fileUrl(req.getFileUrl())
                .isPaid(req.getIsPaid())
                .build();

        lectureRoomRepo.save(room);
        // TODO: 태그 저장 로직
        return room.getLectureRoomId();
    }

    /* 5) 강의 수정 */
    public void updateLecture(Long expertId, Long roomId, LectureUpdateRequestDto req) {
        LectureRoom room = fetchOwnedRoom(expertId, roomId);
        room.setCoverImageUrl(req.getThumbnail());
        room.setTitle(req.getTitle());
        room.setDescription(req.getDescription());
        room.setFileUrl(req.getFileUrl());
        room.setIsPaid(req.getIsPaid());
        lectureRoomRepo.save(room);
    }

    /* 6) 강의 삭제 */
    public void deleteLecture(Long expertId, Long roomId) {
        lectureRoomRepo.delete(fetchOwnedRoom(expertId, roomId));
    }

    /* 7) 챕터 신규 생성 */
    public Long createChapter(ChapterCreateRequestDto req) {
        LectureRoom room = fetchOwnedRoom(req.getExpertId(), req.getLectureRoomId());

        Lecture chap = Lecture.builder()
                .lectureRoom(room)
                .chapterName(req.getChapterName())
                .expectedTime(req.getExpectedTime())
                .orderNum(req.getOrderNum())
                .videoUrl(req.getVideoUrl())
                .build();

        lectureRepo.save(chap);
        return chap.getLectureId();
    }

    /* 8) 챕터 수정 */
    public void updateChapter(Long expertId, Long chapterId, ChapterUpdateRequestDto req) {
        Lecture chap = fetchOwnedChapter(expertId, chapterId);
        chap.setChapterName(req.getChapterName());
        chap.setExpectedTime(req.getExpectedTime());
        chap.setOrderNum(req.getOrderNum());
        chap.setVideoUrl(req.getVideoUrl());
        lectureRepo.save(chap);
    }

    /* 9) 챕터 삭제 */
    public void deleteChapter(Long expertId, Long chapterId) {
        lectureRepo.delete(fetchOwnedChapter(expertId, chapterId));
    }

    /* 10) 댓글 목록 */
    public List<CommentDto> listComments(Long lectureRoomId) {
        return commentRepo.findAllByLectureRoomId(lectureRoomId).stream()
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
    }

    /* ────────────────────────── private helpers ─────────────────── */

    private LectureRoom fetchOwnedRoom(Long expertId, Long roomId) {
        LectureRoom room = lectureRoomRepo.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의실입니다."));
        if (!room.getExpert().getUser().getUserId().equals(expertId)) {
            throw new IllegalArgumentException("본인 강의실만 접근할 수 있습니다.");
        }
        return room;
    }

    private Lecture fetchOwnedChapter(Long expertId, Long chapterId) {
        Lecture chap = lectureRepo.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 챕터입니다."));
        if (!chap.getLectureRoom().getExpert().getUser().getUserId().equals(expertId)) {
            throw new IllegalArgumentException("본인 강의실의 챕터만 수정/삭제할 수 있습니다.");
        }
        return chap;
    }

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

    private LectureRoomSummaryDto toSummary(LectureRoom room) {

        int  count = membershipRepo
                .findByLectureRoomId(room.getLectureRoomId())
                .size();

        // ① 태그 이름 리스트 조회
        List<String> tags = lectureRepo
                .findDistinctTagNamesByRoomId(room.getLectureRoomId());

        return LectureRoomSummaryDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .thumbnail(room.getCoverImageUrl())
                .title(room.getTitle())
                .expertName(room.getExpert().getUser().getNickname())
                .enrollmentCount(count)
                .isPaid(room.getIsPaid())
                .canEnroll(false)   // 전문가 뷰에서만 사용
                .tags(tags)         // ② Builder에 세팅
                .build();
    }

}
