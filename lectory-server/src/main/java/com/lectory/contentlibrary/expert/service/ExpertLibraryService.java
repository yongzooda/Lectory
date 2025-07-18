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
                        DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    /**
     * 1) 내 강의 목록 (최신순 / 수강자순 / 제목순)
     *    – expertId 기준으로 통일
     */
    public PageDto<LectureRoomSummaryDto> listMyLectures(
            Long expertId, int page, int size, String sort) {

        // 1) 인기순 여부
        boolean byPopularity = sort != null && sort.startsWith("popularity");

        // 2) Pageable 생성
        Pageable pg = byPopularity
                ? PageRequest.of(page, size)          // 인기순: 정렬 직접 지정
                : toPageable(page, size, sort);       // createdAt, title 등

        // 3) 조회 – 모두 Expert.expertId 기준 메서드 사용
        Page<LectureRoom> rooms = byPopularity
                ? lectureRoomRepo.findByExpert_ExpertIdByPopularity(expertId, pg)
                : lectureRoomRepo.findByExpert_ExpertId(expertId, pg);

        // 4) DTO 변환
        return PageDto.of(rooms.map(this::toSummary));
    }


    /**
     * 2) 내 강의 검색 (키워드·태그 + 최신순 / 수강자순 / 제목순)
     *    – 모든 쿼리를 expertId(Expert.expertId) 기준으로 호출
     */
    public PageDto<LectureRoomSummaryDto> searchMyLectures(
            Long expertId,
            String keyword,
            List<String> tags,
            int page,
            int size,
            String sort) {

        boolean hasTags      = tags    != null && !tags.isEmpty();
        boolean hasKeyword   = keyword != null && !keyword.isBlank();
        boolean byPopularity = sort   != null && sort.startsWith("popularity");

        // 1) Pageable
        Pageable pg = byPopularity
                ? PageRequest.of(page, size)
                : toPageable(page, size, sort);

        Page<LectureRoom> rooms;

        /* 2) 필터 조합별 조회 — 모든 메서드가 expertId 기준으로 통일 */

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


        // 3) DTO 변환 후 반환
        return PageDto.of(rooms.map(this::toSummary));
    }



    // ────────────────────────────────────────────────────────────────
// 3) 강의실 상세 (전문가)
// ----------------------------------------------------------------
    public LectureDetailDto getLectureDetailForExpert(Long lectureRoomId, Long expertId) {
        // 1) 권한 및 강의실 로딩
        LectureRoom room = fetchOwnedRoom(expertId, lectureRoomId);

        // 2) 챕터 + 태그 매핑 (각 챕터별 tags 포함)
        List<ChapterDto> chapters = lectureRepo
                .findByLectureRoom_LectureRoomIdOrderByOrderNumAsc(lectureRoomId)
                .stream()
                .map(l -> {
                    // 각 챕터별 태그 조회
                    List<String> tagNames = lectureRepo.findTagNamesByLectureId(l.getLectureId());
                    return new ChapterDto(
                            l.getLectureId(),
                            l.getChapterName(),
                            l.getExpectedTime(),
                            l.getOrderNum(),
                            l.getVideoUrl(),
                            tagNames                          // ← 새로 추가된 tags 필드
                    );
                })
                .toList();

        // 3) 전체 챕터 태그 집계 (중복 제거)
        List<String> allTags = chapters.stream()
                .flatMap(ch -> ch.tags().stream())
                .distinct()
                .toList();

        // 4) 댓글 목록 + 수강생 수
        List<CommentDto> comments = listComments(lectureRoomId);
        int enrolledCnt = membershipRepo.findByLectureRoomId(lectureRoomId).size();

        // 5) DTO 빌드 (fileUrl, 전체 tags, chapters 포함)
        return LectureDetailDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .title(room.getTitle())
                .description(room.getDescription())
                .coverImageUrl(room.getCoverImageUrl())
                .fileUrl(room.getFileUrl())            // ← 전체 자료 URL
                .isPaid(room.getIsPaid())
                .expertName(room.getExpert().getUser().getNickname())
                .createdAt(room.getCreatedAt().format(ISO_FMT))
                .updatedAt(room.getUpdatedAt().format(ISO_FMT))
                .enrollmentCount(enrolledCnt)
                .tags(allTags)                         // ← 전체 태그 집계
                .chapters(chapters)                    // ← 태그 포함된 챕터 리스트
                .lectureComments(comments)
                .isEnrolled(true)                      // 전문가 본인은 항상 수강 상태
                .canEnroll(false)
                .build();
    }


    /* ────────────────────────────────────────────────────────────────
     * 4) 강의실 신규 생성
     * ---------------------------------------------------------------- */
    // ── 4) 강의실 신규 생성 ──
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

    /* 6) 강의 삭제 */
    public void deleteLecture(Long expertId, Long roomId) {
        lectureRoomRepo.delete(fetchOwnedRoom(expertId, roomId));
    }

    // ── 7) 챕터 신규 생성 ──
    public Long createChapter(Long expertId, ChapterCreateRequestDto req) {
        LectureRoom room = fetchOwnedRoom(expertId, req.getLectureRoomId());
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

        // ✅ expertId 로 비교
        if (!room.getExpert().getExpertId().equals(expertId)) {
            throw new IllegalArgumentException("본인 강의실만 접근할 수 있습니다.");
        }
        return room;
    }

    private Lecture fetchOwnedChapter(Long expertId, Long chapterId) {
        Lecture chap = lectureRepo.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 챕터입니다."));

        // ✅ expertId 로 비교
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
            s = Sort.by(sort);   // 기본 ASC
        } else {
            s = Sort.by("createdAt").descending();  // 최신순 기본
        }
        return PageRequest.of(page, size, s);
    }

    private LectureRoomSummaryDto toSummary(LectureRoom room) {

        // 전문가 본인은 항상 “수강중” 처리
        boolean enrolled = true;

        int count = membershipRepo.findByLectureRoomId(room.getLectureRoomId()).size();
        List<String> tags = lectureRepo.findDistinctTagNamesByRoomId(room.getLectureRoomId());
        return LectureRoomSummaryDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .thumbnail(room.getCoverImageUrl())
                .title(room.getTitle())
                .expertName(room.getExpert().getUser().getNickname())
                .enrollmentCount(count)
                .isPaid(room.getIsPaid())
                .enrolled(enrolled)
                .canEnroll(false)
                .tags(tags)
                .build();
    }

}
