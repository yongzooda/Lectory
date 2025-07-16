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
@RequestMapping("/library/expert")
@RequiredArgsConstructor
public class ExpertLibraryController {

    private final ExpertLibraryService svc;

    /** 1) 내 강의 목록 조회 */
    @GetMapping
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> list(
            @RequestParam Long expertId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "정렬 기준: createdAt 또는 popularity, 예: popularity,desc")
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        return ResponseEntity.ok(
                svc.listMyLectures(expertId, page, size, sort)
        );
    }

    /** 2) 내 강의 검색 */
    @GetMapping("/search")
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> search(
            @RequestParam Long expertId,
            @RequestParam String keyword,
            @RequestParam(required = false) java.util.List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "정렬 기준: createdAt 또는 popularity, 예: popularity,desc")
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        return ResponseEntity.ok(
                svc.searchMyLectures(expertId, keyword, tags, page, size, sort)
        );
    }

    /** 3) 댓글 목록 조회 */
    @GetMapping("/{lectureRoomId}/comments")
    public ResponseEntity<List<CommentDto>> comments(
            @PathVariable Long lectureRoomId
    ) {
        List<CommentDto> allComments = svc.listComments(lectureRoomId);
        return ResponseEntity.ok(allComments);
    }


    /** 4) 강의 수정 */
    @PutMapping("/{lectureRoomId}")
    public ResponseEntity<Map<String, String>> updateLecture(
            @PathVariable Long lectureRoomId,
            @RequestParam Long expertId,
            @RequestBody LectureUpdateRequestDto req
    ) {
        svc.updateLecture(expertId, lectureRoomId, req);
        return ResponseEntity.ok(Map.of("message", "강의실 수정이 완료되었습니다."));
    }

    /** 5) 강의 삭제 */
    @DeleteMapping("/{lectureRoomId}")
    public ResponseEntity<Map<String, String>> deleteLecture(
            @PathVariable Long lectureRoomId,
            @RequestParam Long expertId
    ) {
        svc.deleteLecture(expertId, lectureRoomId);
        return ResponseEntity.ok(Map.of("message", "강의가 삭제되었습니다."));
    }

    /** 6) 챕터 수정 */
    @PutMapping("/chapters/{chapterId}")
    public ResponseEntity<Map<String, String>> updateChapter(
            @PathVariable Long chapterId,
            @RequestParam Long expertId,
            @RequestBody ChapterUpdateRequestDto req
    ) {
        svc.updateChapter(expertId, chapterId, req);
        return ResponseEntity.ok(Map.of("message", "챕터가 수정되었습니다."));
    }

    /** 7) 챕터 삭제 */
    @DeleteMapping("/chapters/{chapterId}")
    public ResponseEntity<Map<String, String>> deleteChapter(
            @PathVariable Long chapterId,
            @RequestParam Long expertId
    ) {
        svc.deleteChapter(expertId, chapterId);
        return ResponseEntity.ok(Map.of("message", "챕터가 삭제되었습니다."));
    }
}