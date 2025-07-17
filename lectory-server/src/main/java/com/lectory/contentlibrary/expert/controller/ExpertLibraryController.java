// File: com/lectory/contentlibrary/expert/controller/ExpertLibraryController.java
package com.lectory.contentlibrary.expert.controller;

import com.lectory.contentlibrary.dto.*;
import com.lectory.contentlibrary.expert.service.ExpertLibraryService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/library/expert")
@RequiredArgsConstructor
public class ExpertLibraryController {

    private final ExpertLibraryService svc;

    /* ───────────────────────────────────────────────────────────────
     * 1) 내 강의 목록 (페이지)
     * ---------------------------------------------------------------- */
    @GetMapping
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> list(
            @RequestParam Long expertId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "createdAt 또는 popularity , 예: popularity,desc")
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        return ResponseEntity.ok(
                svc.listMyLectures(expertId, page, size, sort)
        );
    }

    /* 2) 내 강의 검색 (제목·태그) */
    @GetMapping("/search")
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> search(
            @RequestParam Long expertId,
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        return ResponseEntity.ok(
                svc.searchMyLectures(expertId, keyword, tags, page, size, sort)
        );
    }

    /* 3) 강의실 상세 조회 ― 프런트 getLectureDetail() 대응 */
    @GetMapping("/{lectureRoomId}")
    public ResponseEntity<LectureDetailDto> detail(
            @PathVariable Long lectureRoomId,
            @RequestParam Long expertId    // 작성자 확인용
    ) {
        LectureDetailDto dto = svc.getLectureDetailForExpert(lectureRoomId, expertId);
        return ResponseEntity.ok(dto);
    }

    /* 4) 강의실 신규 생성 ― 프런트 createLecture() 대응 */
    @PostMapping
    public ResponseEntity<Map<String, Long>> createLecture(
            @RequestBody LectureCreateRequestDto req
    ) {
        Long id = svc.createLecture(req);
        return ResponseEntity.ok(Map.of("lectureRoomId", id));
    }

    /* 5) 강의 수정 */
    @PutMapping("/{lectureRoomId}")
    public ResponseEntity<Map<String, String>> updateLecture(
            @PathVariable Long lectureRoomId,
            @RequestParam Long expertId,
            @RequestBody LectureUpdateRequestDto req
    ) {
        svc.updateLecture(expertId, lectureRoomId, req);
        return ResponseEntity.ok(Map.of("message", "강의실 수정 완료"));
    }

    /* 6) 강의 삭제 */
    @DeleteMapping("/{lectureRoomId}")
    public ResponseEntity<Map<String, String>> deleteLecture(
            @PathVariable Long lectureRoomId,
            @RequestParam Long expertId
    ) {
        svc.deleteLecture(expertId, lectureRoomId);
        return ResponseEntity.ok(Map.of("message", "강의실 삭제 완료"));
    }

    /* 7) 챕터 신규 생성 ― 프런트 createChapter() 대응 */
    @PostMapping("/chapters")
    public ResponseEntity<Map<String, Long>> createChapter(
            @RequestBody ChapterCreateRequestDto req
    ) {
        Long id = svc.createChapter(req);
        return ResponseEntity.ok(Map.of("chapterId", id));
    }

    /* 8) 챕터 수정 */
    @PutMapping("/chapters/{chapterId}")
    public ResponseEntity<Map<String, String>> updateChapter(
            @PathVariable Long chapterId,
            @RequestParam Long expertId,
            @RequestBody ChapterUpdateRequestDto req
    ) {
        svc.updateChapter(expertId, chapterId, req);
        return ResponseEntity.ok(Map.of("message", "챕터 수정 완료"));
    }

    /* 9) 챕터 삭제 */
    @DeleteMapping("/chapters/{chapterId}")
    public ResponseEntity<Map<String, String>> deleteChapter(
            @PathVariable Long chapterId,
            @RequestParam Long expertId
    ) {
        svc.deleteChapter(expertId, chapterId);
        return ResponseEntity.ok(Map.of("message", "챕터 삭제 완료"));
    }

    /* 10) 댓글 목록 (전문가 뷰에서도 필요 시) */
    @GetMapping("/{lectureRoomId}/comments")
    public ResponseEntity<List<CommentDto>> comments(
            @PathVariable Long lectureRoomId
    ) {
        return ResponseEntity.ok(svc.listComments(lectureRoomId));
    }
}
