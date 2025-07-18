package com.lectory.contentlibrary.student.controller;

import com.lectory.contentlibrary.dto.*;
import com.lectory.contentlibrary.student.service.StudentLibraryService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @RequestParam Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "정렬 기준: createdAt 또는 popularity, 예: popularity,desc")
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        return ResponseEntity.ok(
                svc.listLectureRooms(memberId, page, size, sort)
        );
    }

    /** 2) 제목·태그 검색 */
    @GetMapping("/search")
    public ResponseEntity<PageDto<LectureRoomSummaryDto>> search(
            @RequestParam Long memberId,
            @RequestParam(required = false, defaultValue = "") String search,   // 🔹 변경
            @RequestParam(required = false) List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "정렬 기준: createdAt 또는 popularity, 예: popularity,desc")
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        return ResponseEntity.ok(
                svc.searchLectureRooms(memberId, search, tags, page, size, sort)
        );
    }

    /** 3) 상세 조회 (수강 전·후 모두) */
    @GetMapping("/{lectureRoomId}")
    public ResponseEntity<LectureDetailDto> detail(
            @PathVariable Long lectureRoomId,
            @RequestParam Long memberId
    ) {
        return ResponseEntity.ok(
                svc.getLectureDetail(memberId, lectureRoomId)
        );
    }

    /** 4) 수강신청 */
    @PostMapping("/{lectureRoomId}/enroll")
    public ResponseEntity<EnrollResponseDto> enroll(
            @PathVariable Long lectureRoomId,
            @RequestBody EnrollRequestDto req
    ) {
        EnrollResponseDto dto = svc.enroll(req.getMemberId(), lectureRoomId);

        // 유료 강의실인데 무료 구독자라서 결제가 필요하면 402 + paymentUrl 응답
        if (!dto.isSuccess() && dto.getPaymentUrl() != null) {
            return ResponseEntity
                    .status(HttpStatus.PAYMENT_REQUIRED)     // 402
                    .body(dto);
        }

        // 정상 수강신청 완료
        return ResponseEntity.ok(dto);
    }


    /** 5) 댓글 작성 */
    @PostMapping("/{lectureRoomId}/comments")
    public ResponseEntity<CommentResponseDto> comment(
            @PathVariable Long lectureRoomId,
            @RequestBody CommentRequestDto req
    ) {
        return ResponseEntity.ok(
                svc.postComment(req.getMemberId(), lectureRoomId, req.getContent())
        );
    }
}
