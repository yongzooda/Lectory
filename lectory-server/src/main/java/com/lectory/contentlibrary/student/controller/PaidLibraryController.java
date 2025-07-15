// File: PaidLibraryController.java
// Package: com.lectory.contentlibrary.student.controller

package com.lectory.contentlibrary.student.controller;

import com.lectory.contentlibrary.dto.EnrollRequestDto;
import com.lectory.contentlibrary.dto.EnrollResponseDto;
import com.lectory.contentlibrary.student.service.StudentLibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Paid 구독자 전용: 수강신청
 */
@RestController
@RequestMapping("/library/paid")
@RequiredArgsConstructor
public class PaidLibraryController {

    private final StudentLibraryService svc;

    /** 유료 강의실 포함 모든 강의실 수강신청 가능 */
    @PostMapping("/{lectureRoomId}/enroll")
    public ResponseEntity<EnrollResponseDto> enroll(
            @PathVariable Long lectureRoomId,
            @RequestBody EnrollRequestDto req
    ) {
        return ResponseEntity.ok(
                svc.enroll(req.getMemberId(), lectureRoomId)
        );
    }
}
