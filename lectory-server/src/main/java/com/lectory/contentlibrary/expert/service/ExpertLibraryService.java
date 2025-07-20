// File: src/main/java/com/lectory/contentlibrary/expert/service/ExpertLibraryService.java
package com.lectory.contentlibrary.expert.service;

import com.lectory.common.domain.Tag;
import com.lectory.common.domain.lecture.*;
import com.lectory.common.domain.user.Expert;
import com.lectory.common.domain.user.User;
import com.lectory.common.repository.TagRepository;
import com.lectory.contentlibrary.dto.*;
import com.lectory.contentlibrary.repository.*;
import com.lectory.user.repository.ExpertRepository;
import com.lectory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 전문가 전용 – 콘텐츠 라이브러리 서비스
 */
@Service
@RequiredArgsConstructor
public class ExpertLibraryService {

    /* ─── Repository 의존성 ─────────────────────────────────────── */
    private final LectureRoomRepository    lectureRoomRepo;
    private final LectureRepository        lectureRepo;
    private final LectureTagRepository     lectureTagRepo;   // 복합 PK 기반
    private final TagRepository tagRepo;
    private final LectureCommentRepository commentRepo;
    private final MembershipRepository     membershipRepo;
    private final UserRepository           userRepo;
    private final ExpertRepository         expertRepo;

    private static final DateTimeFormatter ISO_FMT =
            DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    /* ─────────────────────────────────────────────────────────────
     * 1) 내 강의 목록
     * ──────────────────────────────────────────────────────────── */
    public PageDto<LectureRoomSummaryDto> listMyLectures(
            Long expertId, int page, int size, String sort) {

        boolean byPopularity = sort != null && sort.startsWith("popularity");
        Pageable pg = byPopularity
                ? PageRequest.of(page, size)
                : toPageable(page, size, sort);

        Page<LectureRoom> rooms = byPopularity
                ? lectureRoomRepo.findByExpert_ExpertIdByPopularity(expertId, pg)
                : lectureRoomRepo.findByExpert_ExpertId(expertId, pg);

        return PageDto.of(rooms.map(this::toSummary));
    }

    /* ─────────────────────────────────────────────────────────────
     * 2) 내 강의 검색
     * ──────────────────────────────────────────────────────────── */
    public PageDto<LectureRoomSummaryDto> searchMyLectures(
            Long expertId, String keyword, List<String> tags,
            int page, int size, String sort) {

        boolean hasTags      = tags    != null && !tags.isEmpty();
        boolean hasKeyword   = keyword != null && !keyword.isBlank();
        boolean byPopularity = sort   != null && sort.startsWith("popularity");

        Pageable pg = byPopularity
                ? PageRequest.of(page, size)
                : toPageable(page, size, sort);

        Page<LectureRoom> rooms;

        if (hasTags && hasKeyword) {
            rooms = byPopularity
                    ? lectureRoomRepo.findByExpertAndKeywordAndTagsByPopularity(
                    expertId, keyword, tags, pg)
                    : lectureRoomRepo.findByExpertAndKeywordAndTags(
                    expertId, keyword, tags, pg);

        } else if (hasTags) {
            rooms = byPopularity
                    ? lectureRoomRepo.findByExpertAndTagsByPopularity(expertId, tags, pg)
                    : lectureRoomRepo.findByExpertAndTags(expertId, tags, pg);

        } else if (hasKeyword) {
            rooms = byPopularity
                    ? lectureRoomRepo.findByExpertAndKeywordByPopularity(expertId, keyword, pg)
                    : lectureRoomRepo.findByExpertAndKeyword(expertId, keyword, pg);

        } else {
            rooms = byPopularity
                    ? lectureRoomRepo.findByExpert_ExpertIdByPopularity(expertId, pg)
                    : lectureRoomRepo.findByExpert_ExpertId(expertId, pg);
        }

        return PageDto.of(rooms.map(this::toSummary));
    }

    /* ─────────────────────────────────────────────────────────────
     * 3) 강의실 상세 (전문가)
     * ──────────────────────────────────────────────────────────── */
    public LectureDetailDto getLectureDetailForExpert(Long lectureRoomId, Long expertId) {

        LectureRoom room = fetchOwnedRoom(expertId, lectureRoomId);

        List<ChapterDto> chapters = lectureRepo
                .findByLectureRoom_LectureRoomIdOrderByOrderNumAsc(lectureRoomId)
                .stream()
                .map(l -> {
                    List<String> tagNames =
                            lectureRepo.findTagNamesByLectureId(l.getLectureId());
                    return new ChapterDto(
                            l.getLectureId(),
                            l.getChapterName(),
                            l.getExpectedTime(),
                            l.getOrderNum(),
                            l.getVideoUrl(),
                            tagNames
                    );
                })
                .toList();

        List<String> allTags = chapters.stream()
                .flatMap(c -> c.tags().stream())
                .distinct()
                .toList();

        List<CommentDto> comments = listComments(lectureRoomId);
        int enrolledCnt = membershipRepo.findByLectureRoomId(lectureRoomId).size();

        return LectureDetailDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .title(room.getTitle())
                .description(room.getDescription())
                .coverImageUrl(room.getCoverImageUrl())
                .fileUrl(room.getFileUrl())
                .isPaid(room.getIsPaid())
                .expertName(room.getExpert().getUser().getNickname())
                .createdAt(room.getCreatedAt().format(ISO_FMT))
                .updatedAt(room.getUpdatedAt().format(ISO_FMT))
                .enrollmentCount(enrolledCnt)
                .tags(allTags)
                .chapters(chapters)
                .lectureComments(comments)
                .isEnrolled(true)
                .canEnroll(false)
                .build();
    }

    /* ─────────────────────────────────────────────────────────────
     * 4) 강의실 신규 생성
     * ──────────────────────────────────────────────────────────── */
    public Long createLecture(Long expertId, LectureCreateRequestDto req) {
        Expert expert = expertRepo.findById(expertId)
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

    /* 6) 강의실 삭제 */
    @Transactional
    public void deleteLecture(Long expertId, Long roomId) {

        // (0) 소유권 검증 + 강의실 엔티티 로드
        LectureRoom room = fetchOwnedRoom(expertId, roomId);

        /* (1) 댓글 → 수강신청 레코드 선삭제 (FK 해제) */
        commentRepo.deleteByLectureRoomId(roomId);
        membershipRepo.deleteByLectureRoomId(roomId);

        /* (2) 하위 챕터 ID 조회 */
        List<Long> lecIds = lectureRepo.findIdsByLectureRoom(roomId);

        if (!lecIds.isEmpty()) {
            /* (3) 태그 매핑 삭제 */
            lectureTagRepo.deleteAllByLectureIds(lecIds);

            /* (4) 챕터(lecture) 일괄 삭제 */
            lectureRepo.deleteByLectureRoom(roomId);
        }

        /* (5) 마지막으로 강의실 삭제 */
        lectureRoomRepo.delete(room);
    }



    /* ─────────────────────────────────────────────────────────────
     * 7) 챕터 신규 생성
     * ──────────────────────────────────────────────────────────── */
    @Transactional
    public Long createChapter(Long expertId, ChapterCreateRequestDto dto) {

        LectureRoom room = fetchOwnedRoom(expertId, dto.getLectureRoomId());

        Lecture lec = lectureRepo.save(Lecture.builder()
                .lectureRoom(room)
                .chapterName(dto.getChapterName())
                .expectedTime(dto.getExpectedTime())
                .orderNum(dto.getOrderNum())
                .videoUrl(dto.getVideoUrl())
                .build());

        saveTagsForLecture(lec.getLectureId(), dto.getTags());
        return lec.getLectureId();
    }

    /* 8) 챕터 수정 */
    @Transactional
    public void updateChapter(Long expertId, Long chapterId, ChapterUpdateRequestDto dto) {

        Lecture lec = fetchOwnedChapter(expertId, chapterId);

        lec.setChapterName(dto.getChapterName());
        lec.setExpectedTime(dto.getExpectedTime());
        lec.setOrderNum(dto.getOrderNum());
        lec.setVideoUrl(dto.getVideoUrl());

        /* 태그 전면 교체 */
        lectureTagRepo.deleteAllByLectureId(chapterId);
        saveTagsForLecture(chapterId, dto.getTags());
    }

    /* 9) 챕터 삭제 */
    @Transactional
    public void deleteChapter(Long expertId, Long chapterId) {

        // (1) 소유권 확인 & 엔티티 로드
        Lecture lecture = fetchOwnedChapter(expertId, chapterId);

        // (2) 태그 매핑 먼저 제거
        lectureTagRepo.deleteAllByLectureId(chapterId);

        // 필요하면 댓글·진도 등 다른 자식 테이블도 여기서 선삭제
        // commentRepo.deleteByLectureId(chapterId);

        // (3) 본체 삭제
        lectureRepo.delete(lecture);
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
                            c.getCreatedAt().format(ISO_FMT));
                })
                .collect(Collectors.toList());
    }

    /* ─────────────── private helpers ──────────────── */

    /** 태그 목록 저장(INSERT) – Tag 테이블에 없으면 생성 후 매핑 */
    private void saveTagsForLecture(Long lectureId, List<String> tags) {
        if (tags == null) return;

        tags.forEach(t -> {
            Long tagId = tagRepo.findByName(t)
                    .orElseGet(() -> tagRepo.save(Tag.builder().name(t).build()))
                    .getTagId();

            lectureTagRepo.save(
                    LectureTag.builder()
                            .lectureId(lectureId)
                            .tagId(tagId)
                            .build());
        });
    }

    private LectureRoom fetchOwnedRoom(Long expertId, Long roomId) {
        LectureRoom room = lectureRoomRepo.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의실입니다."));
        if (!room.getExpert().getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("본인 강의실만 접근할 수 있습니다.");
        }
        return room;
    }

    private Lecture fetchOwnedChapter(Long expertId, Long chapterId) {
        Lecture chap = lectureRepo.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 챕터입니다."));
        if (!chap.getLectureRoom().getExpert().getExpertId().equals(expertId)) {
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

        int count = membershipRepo.findByLectureRoomId(room.getLectureRoomId()).size();
        List<String> tags = lectureRepo.findDistinctTagNamesByRoomId(room.getLectureRoomId());

        return LectureRoomSummaryDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .thumbnail(room.getCoverImageUrl())
                .title(room.getTitle())
                .expertName(room.getExpert().getUser().getNickname())
                .enrollmentCount(count)
                .isPaid(room.getIsPaid())
                .enrolled(true)     // 전문가 본인은 항상 수강중
                .canEnroll(false)
                .tags(tags)
                .build();
    }
}
