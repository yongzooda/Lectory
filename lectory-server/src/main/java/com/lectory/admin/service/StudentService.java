package com.lectory.admin.service;

import com.lectory.admin.dto.StudentResponseDto;
import java.util.List;

public interface StudentService {
    // null이면 전체, 아니면 해당 타입만
    List<StudentResponseDto> getStudentsByType(String userType);
}
