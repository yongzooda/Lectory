package com.lectory.user.service;

import com.lectory.common.domain.user.Expert;
import com.lectory.common.domain.user.User;
import com.lectory.user.dto.ExpertMypageResponse;
import com.lectory.user.dto.ExpertSignUpRequest;
import com.lectory.user.dto.ExpertUpdateRequest;
import com.lectory.user.dto.UserUpdateRequest;
import com.lectory.user.repository.ExpertRepository;
import com.lectory.user.repository.UserRepository;
import com.lectory.user.repository.UserTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ExpertService {
    private final UserRepository userRepository;
    private final UserTypeRepository userTypeRepository;
    private final ExpertRepository expertRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
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

        expert.setUser(savedUser);
        expertRepository.save(expert);

        return savedUser;

    }

    @Transactional(readOnly = true)
    public ExpertMypageResponse getExpertMypage(User user){
        Expert expert = expertRepository.findByUser(user).orElseThrow(() -> new IllegalStateException("전문가 정보를 찾을 수 없습니다."));

        return ExpertMypageResponse.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .userType(user.getUserType().getUserType())
                .portfolioFileUrl(expert.getPortfolioFileUrl())
                .approval_status(expert.getApprovalStatus().name())
                .profileImageUrl(expert.getProfileImageUrl())
                .build();
    }

    @Transactional
    public void updateExpertInfo(User user, ExpertUpdateRequest request) {

        User persistentUser = userRepository.findById(user.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));


        Expert expert = expertRepository.findByUser(persistentUser)
                .orElseThrow(() -> new IllegalStateException("전문가 정보를 찾을 수 없습니다."));


        if (StringUtils.hasText(request.getNickname()) &&
                !request.getNickname().equals(persistentUser.getNickname())) {

            if (request.getNickname().length() < 2 || request.getNickname().length() > 20) {
                throw new IllegalArgumentException("닉네임은 2자 이상 20자 이하로 입력하세요.");
            }

            if (!request.getNickname().matches("^[a-zA-Z0-9가-힣]+$")) {
                throw new IllegalArgumentException("닉네임은 특수문자를 포함할 수 없습니다.");
            }

            if (userRepository.existsByNickname(request.getNickname())) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }

            persistentUser.setNickname(request.getNickname());
            System.out.println("닉네임 변경됨: " + request.getNickname());
        }

        // 비밀번호 수정
        if (StringUtils.hasText(request.getPassword()) || StringUtils.hasText(request.getPasswordConfirm())) {

            if (!StringUtils.hasText(request.getPassword()) || !StringUtils.hasText(request.getPasswordConfirm())) {
                throw new IllegalArgumentException("비밀번호와 비밀번호 확인은 모두 입력되어야 합니다.");
            }

            if (request.getPassword().length() < 8 || request.getPassword().length() > 20) {
                throw new IllegalArgumentException("비밀번호는 8자 이상 20자 이하로 입력하세요.");
            }

            if (!request.getPassword().matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,20}$")) {
                throw new IllegalArgumentException("비밀번호는 영문자, 숫자, 특수문자를 모두 포함해야 합니다.");
            }

            if (!request.getPassword().equals(request.getPasswordConfirm())) {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
            }

            if (passwordEncoder.matches(request.getPassword(), persistentUser.getPassword())) {
                throw new IllegalArgumentException("새로운 비밀번호는 기존 비밀번호와 달라야 합니다.");
            }

            String encodedPassword = passwordEncoder.encode(request.getPassword());
            persistentUser.setPassword(encodedPassword);
            System.out.println("비밀번호 변경됨");
        }

        // 포트폴리오 URL 수정
        if (StringUtils.hasText(request.getPortfolioFileUrl())) {
            expert.setPortfolioFileUrl(request.getPortfolioFileUrl());
            System.out.println("portfolioFileUrl 변경됨: " + request.getPortfolioFileUrl());
        }

        // 프로필 이미지 URL 수정
        if (StringUtils.hasText(request.getProfileImageUrl())) {
            expert.setProfileImageUrl(request.getProfileImageUrl());
            System.out.println("profileImageUrl 변경됨: " + request.getProfileImageUrl());
        }

    }

}
