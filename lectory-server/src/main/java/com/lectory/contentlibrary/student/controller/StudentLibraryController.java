// File: StudentLibraryController.java
// Package: com.lectory.contentlibrary.student.controller

package com.lectory.contentlibrary.student.controller;

import com.lectory.contentlibrary.student.dto.*;
import com.lectory.contentlibrary.student.service.StudentLibraryService;
import com.lectory.lecture.dto.LectureDetailDto;
import com.lectory.lecture.dto.LectureRoomSummaryDto;
import com.lectory.lecture.dto.PageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Free/paid 공통: 목록·검색·상세·댓글
 */
@RestController
@RequestMapping({"/library/free", "/library/paid"})
@RequiredArgsConstructor
public class StudentLibraryController {

    private final StudentLibraryService svc;

    /** 인기순/최신순 목록 조회 */
    @GetMapping
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> list(
            @RequestParam Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "popularity") String sort
    ) {
        return ResponseEntity.ok(svc.listLectureRooms(memberId, page, size, sort));
    }

    /** 제목·전문가·태그 검색 */
    @GetMapping("/search")
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> search(
            @RequestParam Long memberId,
            @RequestParam String search,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "relevance") String sort
    ) {
        return ResponseEntity.ok(svc.searchLectureRooms(memberId, search, tags, page, size, sort));
    }

    /** 강의실 상세 조회 (수강신청 전/후 모두 허용) */
    @GetMapping("/{lectureRoomId}")
    public ResponseEntity<LectureDetailDto> detail(
            @PathVariable Long lectureRoomId,
            @RequestParam Long memberId
    ) {
        return ResponseEntity.ok(svc.getLectureDetail(memberId, lectureRoomId));
    }

    /** 댓글 작성 (수강 중이어야만 가능) */
    @PostMapping("/{lectureRoomId}/comments")
    public ResponseEntity<CommentResponse> comment(
            @PathVariable Long lectureRoomId,
            @RequestBody CommentRequest req
    ) {
        return ResponseEntity.ok(
                svc.postComment(req.getMemberId(), lectureRoomId, req.getContent())
        );
    }
}
