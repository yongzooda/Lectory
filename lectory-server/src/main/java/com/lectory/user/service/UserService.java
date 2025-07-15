package com.lectory.user.service;

import com.lectory.common.domain.user.User;
import com.lectory.user.dto.UserSignUpRequest;
import com.lectory.user.repository.UserRepository;
import com.lectory.user.repository.UserTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserTypeRepository userTypeRepository;

    public User register(UserSignUpRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        var defaultType = userTypeRepository.findById("FREE").orElseThrow(() -> new IllegalStateException("기본 권한이 존재하지 않습니다."));

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .nickname(request.getNickname())
                .userType(defaultType).build();

        return userRepository.save(user);
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 유저입니다."));
    }

    //구독에 따른 유저 업데이트
    @Transactional
    public void updatePaidUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        var paidType = userTypeRepository.findById("PAID").orElseThrow(() -> new IllegalStateException("유료 타입 없음"));

        LocalDateTime now = LocalDateTime.now();

        //첫 결제
        if ("FREE".equals(user.getUserType().getUserType()) || user.getSubscriptionStartDate() == null) {
            user.setSubscriptionStartDate(now);
            user.setSubscriptionEndDate(now.plusMonths(1));
        } else if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isAfter(now)
        ) {
            // 정기 결제 중에 연장
            user.setSubscriptionEndDate(user.getSubscriptionEndDate().plusMonths(1));
        } else {
            // 구독 만료 시 재결제 (자동 연장이고 구독 취소 기능 만들거니 안쓸테지만 일단 추가)
            user.setSubscriptionStartDate(now);
            user.setSubscriptionEndDate(now.plusMonths(1));
        }

        user.setUserType(paidType);
        userRepository.save(user);
    }

}