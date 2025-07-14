// File: FreeLibraryController.java
// Package: com.lectory.contentlibrary.student.controller

package com.lectory.contentlibrary.student.controller;

import com.lectory.contentlibrary.student.dto.EnrollRequest;
import com.lectory.contentlibrary.student.dto.EnrollResponse;
import com.lectory.contentlibrary.student.service.StudentLibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Free 구독자 전용: 수강신청
 */
@RestController
@RequestMapping("/library/free")
@RequiredArgsConstructor
public class FreeLibraryController {

    private final StudentLibraryService svc;

    /** 무료 강의실에 한해 수강신청 가능 */
    @PostMapping("/{lectureRoomId}/enroll")
    public ResponseEntity<EnrollResponse> enroll(
            @PathVariable Long lectureRoomId,
            @RequestBody EnrollRequest req
    ) {
        return ResponseEntity.ok(
                svc.enroll(req.getMemberId(), lectureRoomId)
        );
    }
}
