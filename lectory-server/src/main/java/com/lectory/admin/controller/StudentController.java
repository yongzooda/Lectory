package com.lectory.admin.controller;

import com.lectory.admin.dto.StudentResponseDto;
import com.lectory.admin.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @Operation(
            summary = "수강생 목록 조회",
            description = "user_type(FREE, PAID)에 따라 수강생 목록을 조회함. 파라미터 없으면 전체 조회."
    )
    @ApiResponse(
            responseCode = "200",
            description = "성공적으로 수강생 목록을 반환함",
            content = @Content(mediaType = "application/json")
    )
    // @param type FREE 또는 PAID (없으면 전체 조회)
    @GetMapping
    public List<StudentResponseDto> getStudents(
            @Parameter(
                    name = "type",
                    description = "조회할 사용자 유형 (FREE / PAID)",
                    example = "FREE"
            )
            @RequestParam(value = "type", required = false) String type
    ) {
    //getStudents(@RequestParam(value = "type", required = false) String type) {
        return studentService.getStudentsByType(type);
    }
}
