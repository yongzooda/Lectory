// File: com/lectory/contentlibrary/expert/service/ExpertLibraryService.java
package com.lectory.contentlibrary.expert.service;

import com.lectory.common.domain.lecture.Lecture;
import com.lectory.common.domain.lecture.LectureComment;
import com.lectory.common.domain.lecture.LectureRoom;
import com.lectory.common.domain.user.User;
import com.lectory.contentlibrary.dto.ChapterUpdateRequestDto;
import com.lectory.contentlibrary.dto.CommentDto;
import com.lectory.contentlibrary.dto.LectureRoomSummaryDto;
import com.lectory.contentlibrary.dto.LectureUpdateRequestDto;
import com.lectory.contentlibrary.dto.PageDto;
import com.lectory.contentlibrary.repository.LectureCommentRepository;
import com.lectory.contentlibrary.repository.LectureRepository;
import com.lectory.contentlibrary.repository.LectureRoomRepository;
import com.lectory.contentlibrary.repository.MembershipRepository;
import com.lectory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpertLibraryService {
    private final LectureRoomRepository lectureRoomRepo;
    private final LectureRepository lectureRepo;
    private final LectureCommentRepository commentRepo;
    private final MembershipRepository membershipRepo;
    private final UserRepository userRepo;

    private static final DateTimeFormatter ISO_FMT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    /** 1) 내 강의 목록 조회 */
    public PageDto<LectureRoomSummaryDto> listMyLectures(Long expertId, int page, int size, String sort) {
        Pageable pg = toPageable(page, size, sort);
        Page<LectureRoom> rooms = lectureRoomRepo.findByExpertUserUserId(expertId, pg);
        Page<LectureRoomSummaryDto> dtos = rooms.map(this::toSummary);
        return PageDto.of(dtos);
    }

    /** 2) 내 강의 검색 (제목·태그) */
    public PageDto<LectureRoomSummaryDto> searchMyLectures(
            Long expertId,
            String keyword,
            List<String> tags,
            int page,
            int size,
            String sort
    ) {
        Pageable pg = toPageable(page, size, sort);
        Page<LectureRoom> rooms;

        if (tags != null && !tags.isEmpty()) {
            // 태그 검색 모드
            rooms = lectureRoomRepo.findByExpertAndLectureTagNames(expertId, tags, pg);
        } else {
            // 제목(키워드) 검색 모드
            rooms = lectureRoomRepo
                    .findByExpertUserUserIdAndTitleContainingIgnoreCase(expertId, keyword, pg);
        }

        return PageDto.of(rooms.map(this::toSummary));
    }

    /**
     * 3) 댓글 목록 조회 (페이징 제거, 전체 조회)
     */
    public List<CommentDto> listComments(Long lectureRoomId) {
        // 기존 리포에서 한번에 전체 List<LectureComment> 조회
        List<LectureComment> comments = commentRepo.findAllByLectureRoomId(lectureRoomId);

        // DTO로 매핑
        return comments.stream()
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

    /** 4) 강의 수정 */
    public void updateLecture(Long expertId, Long lectureRoomId, LectureUpdateRequestDto req) {
        LectureRoom room = lectureRoomRepo.findById(lectureRoomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의실입니다."));
        if (!room.getExpert().getUser().getUserId().equals(expertId)) {
            throw new IllegalArgumentException("작성자만 수정할 수 있습니다.");
        }
        room.setCoverImageUrl(req.getThumbnail());
        room.setTitle(req.getTitle());
        room.setDescription(req.getDescription());
        room.setFileUrl(req.getFileUrl());
        room.setIsPaid(req.getIsPaid());
        lectureRoomRepo.save(room);
        // 태그 업데이트 로직은 필요 시 추가
    }

    /** 5) 강의 삭제 */
    public void deleteLecture(Long expertId, Long lectureRoomId) {
        LectureRoom room = lectureRoomRepo.findById(lectureRoomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의실입니다."));
        if (!room.getExpert().getUser().getUserId().equals(expertId)) {
            throw new IllegalArgumentException("작성자만 삭제할 수 있습니다.");
        }
        lectureRoomRepo.delete(room);
    }

    /** 6) 챕터 수정 */
    public void updateChapter(Long expertId, Long chapterId, ChapterUpdateRequestDto req) {
        Lecture chapter = lectureRepo.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 챕터입니다."));
        if (!chapter.getLectureRoom().getExpert().getUser().getUserId().equals(expertId)) {
            throw new IllegalArgumentException("작성자만 수정할 수 있습니다.");
        }
        chapter.setChapterName(req.getChapterName());
        chapter.setExpectedTime(req.getExpectedTime());
        chapter.setOrderNum(req.getOrderNum());
        chapter.setVideoUrl(req.getVideoUrl());
        lectureRepo.save(chapter);
    }

    /** 7) 챕터 삭제 */
    public void deleteChapter(Long expertId, Long chapterId) {
        Lecture chapter = lectureRepo.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 챕터입니다."));
        if (!chapter.getLectureRoom().getExpert().getUser().getUserId().equals(expertId)) {
            throw new IllegalArgumentException("작성자만 삭제할 수 있습니다.");
        }
        lectureRepo.delete(chapter);
    }

    // ─────── helpers ───────
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
        String expertNick = room.getExpert().getUser().getNickname();
        return LectureRoomSummaryDto.builder()
                .lectureRoomId(room.getLectureRoomId())
                .thumbnail(room.getCoverImageUrl())
                .title(room.getTitle())
                .expertName(expertNick)
                .enrollmentCount(count)
                .isPaid(room.getIsPaid())
                .canEnroll(false)
                .build();
    }
}
