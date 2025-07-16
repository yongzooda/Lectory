package com.lectory.user.service;

import com.lectory.common.domain.user.Expert;
import com.lectory.common.domain.user.User;
import com.lectory.user.dto.ExpertSignUpRequest;
import com.lectory.user.repository.ExpertRepository;
import com.lectory.user.repository.UserRepository;
import com.lectory.user.repository.UserTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExpertService {
    private final UserRepository userRepository;
    private final UserTypeRepository userTypeRepository;
    private final ExpertRepository expertRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerExpert(ExpertSignUpRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        var expertType = userTypeRepository.findById("EXPERT").orElseThrow(() -> new IllegalStateException("전문가 권한이 존재하지 않습니다."));

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .nickname(request.getNickname())
                .userType(expertType)
                .build();

        User savedUser = userRepository.save(user);

        Expert expert = Expert.builder()
                .user(savedUser)
                .portfolioFileUrl(request.getPortfolioFileUrl())
                .profileImageUrl(request.getProfileImageUrl())
                .build();

        expertRepository.save(expert);

        return savedUser;

    }
}
