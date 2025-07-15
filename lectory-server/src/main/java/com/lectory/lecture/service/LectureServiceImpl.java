// LectureServiceImpl.java
package com.lectory.lecture.service;

import com.lectory.common.domain.lecture.Lecture;
import com.lectory.common.domain.lecture.LectureComment;
import com.lectory.common.domain.lecture.LectureRoom;
import com.lectory.common.domain.user.User;
import com.lectory.lecture.dto.ChapterDto;
import com.lectory.lecture.dto.CommentDto;
import com.lectory.lecture.dto.LectureDetailDto;
import com.lectory.lecture.dto.LectureRoomSummaryDto;
import com.lectory.lecture.repository.LectureCommentRepository;
import com.lectory.lecture.repository.LectureRepository;
import com.lectory.lecture.repository.LectureRoomRepository;
import com.lectory.lecture.repository.MembershipRepository;
import com.lectory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LectureServiceImpl implements LectureService {

    private final LectureRoomRepository lectureRoomRepository;
    private final LectureRepository     lectureRepository;
    private final LectureCommentRepository lectureCommentRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository       userRepository;

    private static final DateTimeFormatter ISO_FMT = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    @Override
    public Page<LectureRoomSummaryDto> listLectureRooms(Long memberId, int page, int size, String sort) {
        Pageable pageable = toPageable(page, size, sort);
        return lectureRoomRepository.findAll(pageable)
                .map(room -> toSummary(room, memberId));
    }

    @Override
    public Page<LectureRoomSummaryDto> searchLectureRooms(
            Long memberId,
            String search,
            List<String> tags,
            int page,
            int size,
            String sort
    ) {
        Pageable pageable = toPageable(page, size, sort);
        return lectureRoomRepository
                .findByTitleContainingIgnoreCase(search, pageable)
                .map(room -> toSummary(room, memberId));
    }

    @Override
    public LectureDetailDto getLectureDetail(Long memberId, Long lectureRoomId) {
        LectureRoom room = lectureRoomRepository.findByLectureRoomId(lectureRoomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의실: " + lectureRoomId));

        // 1) 챕터 목록
        List<ChapterDto> chapters = lectureRepository
                .findByLectureRoom_LectureRoomIdOrderByOrderNumAsc(lectureRoomId)
                .stream()
                .map(l -> new ChapterDto(l.getChapterName(), l.getExpectedTime()))
                .collect(Collectors.toList());

        // 2) 댓글 목록
        List<CommentDto> comments = lectureCommentRepository.findAll().stream()
                .filter(c -> c.getLectureRoomId().equals(lectureRoomId))
                .map(c -> {
                    User author = userRepository.findById(c.getUserId())
                            .orElseThrow(() -> new IllegalArgumentException("Unknown user: " + c.getUserId()));
                    return new CommentDto(
                            c.getLectureCommentId(),
                            author.getNickname(),
                            c.getContent(),
                            c.getCreatedAt().format(ISO_FMT)
                    );
                })
                .collect(Collectors.toList());

        // 3) 수강 여부
        boolean enrolled = membershipRepository
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

    // —————— private helpers ——————

    /** "field,DESC" or "field,ASC" 또는 "field" 형식의 sort 파싱 */
    private Pageable toPageable(int page, int size, String sort) {
        Sort s;
        if (sort != null && sort.contains(",")) {
            String[] arr = sort.split(",", 2);
            s = Sort.by(Sort.Direction.fromString(arr[1].trim()), arr[0].trim());
        } else if (sort != null && !sort.isEmpty()) {
            s = Sort.by(sort);
        } else {
            s = Sort.unsorted();
        }
        return PageRequest.of(page, size, s);
    }

    /** LectureRoom → LectureRoomSummaryDto 변환 */
    private LectureRoomSummaryDto toSummary(LectureRoom room, Long memberId) {
        boolean enrolled = membershipRepository
                .findByUserIdAndLectureRoomId(memberId, room.getLectureRoomId())
                .isPresent();
        int count = membershipRepository.findByLectureRoomId(room.getLectureRoomId()).size();

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
