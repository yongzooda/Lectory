package com.lectory.contentlibrary.expert.controller;

import com.lectory.contentlibrary.dto.*;
import com.lectory.contentlibrary.expert.service.ExpertLibraryService;
import com.lectory.user.security.CustomUserDetail;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/library/expert")
@RequiredArgsConstructor
public class ExpertLibraryController {

    private final ExpertLibraryService svc;

    /** 1) 내 강의 목록 (페이지) */
    @GetMapping
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> list(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "createdAt 또는 popularity , 예: popularity,desc")
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Long expertId = userDetail.getUser().getExpert().getExpertId();
        PageDto<LectureRoomSummaryDto> result = svc.listMyLectures(expertId, page, size, sort);
        return ResponseEntity.ok(result);
    }

    /** 2) 내 강의 검색 (제목·태그) */
    @GetMapping("/search")
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> search(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Long expertId = userDetail.getUser().getExpert().getExpertId();
        PageDto<LectureRoomSummaryDto> result =
                svc.searchMyLectures(expertId, keyword, tags, page, size, sort);
        return ResponseEntity.ok(result);
    }

    /** 3) 강의실 상세 조회 */
    @GetMapping("/{lectureRoomId}")
    public ResponseEntity<LectureDetailDto> detail(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long lectureRoomId
    ) {
        Long expertId = userDetail.getUser().getExpert().getExpertId();
        LectureDetailDto dto = svc.getLectureDetailForExpert(lectureRoomId, expertId);
        return ResponseEntity.ok(dto);
    }

    /** 4) 강의실 신규 생성 */
    @PostMapping
    public ResponseEntity<Map<String, Long>> createLecture(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestBody LectureCreateRequestDto req
    ) {
        Long expertId = userDetail.getUser().getExpert().getExpertId();
        Long id = svc.createLecture(expertId, req);
        return ResponseEntity.ok(Map.of("lectureRoomId", id));
    }

    /** 5) 강의 수정 */
    @PutMapping("/{lectureRoomId}")
    public ResponseEntity<Map<String, String>> updateLecture(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long lectureRoomId,
            @RequestBody LectureUpdateRequestDto req
    ) {
        Long expertId = userDetail.getUser().getExpert().getExpertId();
        svc.updateLecture(expertId, lectureRoomId, req);
        return ResponseEntity.ok(Map.of("message", "강의실 수정 완료"));
    }

    /** 6) 강의 삭제 */
    @DeleteMapping("/{lectureRoomId}")
    public ResponseEntity<Map<String, String>> deleteLecture(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long lectureRoomId
    ) {
        Long expertId = userDetail.getUser().getExpert().getExpertId();
        svc.deleteLecture(expertId, lectureRoomId);
        return ResponseEntity.ok(Map.of("message", "강의실 삭제 완료"));
    }

    /** 7) 챕터 신규 생성 */
    @PostMapping("/chapters")
    public ResponseEntity<Map<String, Long>> createChapter(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestBody ChapterCreateRequestDto req
    ) {
        Long expertId = userDetail.getUser().getExpert().getExpertId();
        Long chapterId = svc.createChapter(expertId, req);
        return ResponseEntity.ok(Map.of("chapterId", chapterId));
    }

    /** 8) 챕터 수정 */
    @PutMapping("/chapters/{chapterId}")
    public ResponseEntity<Map<String, String>> updateChapter(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long chapterId,
            @RequestBody ChapterUpdateRequestDto req
    ) {
        Long expertId = userDetail.getUser().getExpert().getExpertId();
        svc.updateChapter(expertId, chapterId, req);
        return ResponseEntity.ok(Map.of("message", "챕터 수정 완료"));
    }

    /** 9) 챕터 삭제 */
    @DeleteMapping("/chapters/{chapterId}")
    public ResponseEntity<Map<String, String>> deleteChapter(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long chapterId
    ) {
        Long expertId = userDetail.getUser().getExpert().getExpertId();
        svc.deleteChapter(expertId, chapterId);
        return ResponseEntity.ok(Map.of("message", "챕터 삭제 완료"));
    }

    /** 10) 댓글 목록 (전문가 뷰) */
    @GetMapping("/{lectureRoomId}/comments")
    public ResponseEntity<List<CommentDto>> comments(
            @PathVariable Long lectureRoomId
    ) {
        return ResponseEntity.ok(svc.listComments(lectureRoomId));
    }
}
