package com.lectory.admin.service;

import com.lectory.admin.dto.StudentResponseDto;
import com.lectory.admin.service.StudentService;
import com.lectory.common.domain.user.User;
import com.lectory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;

    @Override
    public List<StudentResponseDto> getStudentsByType(String userType) {
        List<User> users;

        if (userType == null) {
            // 전체 수강생 조회
            users = userRepository.findAllStudents();
        } else {
            // 특정 권한 수강생 조회 (FREE or PAID)
            users = userRepository.findStudentsByType(userType.toUpperCase());
        }

        return users.stream()
                .map(user -> StudentResponseDto.builder()
                        .userId(user.getUserId())
                        .email(user.getEmail())
                        .nickname(user.getNickname())
                        .userType(user.getUserType().getUserType())
                        .build())
                .collect(Collectors.toList());
    }
}
