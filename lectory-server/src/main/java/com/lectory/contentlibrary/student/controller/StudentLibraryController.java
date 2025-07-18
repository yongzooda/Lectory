package com.lectory.contentlibrary.student.controller;

import com.lectory.contentlibrary.dto.*;
import com.lectory.contentlibrary.student.service.StudentLibraryService;
import com.lectory.user.security.CustomUserDetail;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class StudentLibraryController {

    private final StudentLibraryService svc;

    /** 1) 인기순/최신순 전체 목록 조회 */
    @GetMapping
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> list(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "정렬 기준: createdAt 또는 popularity, 예: popularity,desc")
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Long memberId = userDetail.getUser().getUserId();
        return ResponseEntity.ok(svc.listLectureRooms(memberId, page, size, sort));
    }

    /** 2) 제목·태그 검색 */
    @GetMapping("/search")
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> search(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Long memberId = userDetail.getUser().getUserId();
        return ResponseEntity.ok(
                svc.searchLectureRooms(memberId, search, tags, page, size, sort)
        );
    }

    /** 3) 상세 조회 (수강 전·후 모두) */
    @GetMapping("/{lectureRoomId}")
    public ResponseEntity<LectureDetailDto> detail(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long lectureRoomId
    ) {
        Long memberId = userDetail.getUser().getUserId();
        return ResponseEntity.ok(
                svc.getLectureDetail(memberId, lectureRoomId)
        );
    }

    /** 4) 수강신청 */
    @PostMapping("/{lectureRoomId}/enroll")
    public ResponseEntity<EnrollResponseDto> enroll(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long lectureRoomId
    ) {
        Long memberId = userDetail.getUser().getUserId();
        EnrollResponseDto dto = svc.enroll(memberId, lectureRoomId);

        if (!dto.isSuccess() && dto.getPaymentUrl() != null) {
            // 결제 필요
            return ResponseEntity
                    .status(HttpStatus.PAYMENT_REQUIRED)
                    .body(dto);
        }
        // 정상 수강신청
        return ResponseEntity.ok(dto);
    }


    /** 5) 댓글 작성 */
    @PostMapping("/{lectureRoomId}/comments")
    public ResponseEntity<CommentResponseDto> comment(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PathVariable Long lectureRoomId,
            @RequestBody CommentRequestDto req
    ) {
        Long memberId = userDetail.getUser().getUserId();
        return ResponseEntity.ok(
                svc.postComment(memberId, lectureRoomId, req.getContent())
        );
    }
}
