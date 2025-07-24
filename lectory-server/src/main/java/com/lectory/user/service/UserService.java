package com.lectory.user.service;

import com.lectory.common.domain.user.Expert;
import com.lectory.common.domain.user.User;
import com.lectory.user.dto.UserMypageResponse;
import com.lectory.user.dto.UserSignUpRequest;
import com.lectory.user.dto.UserUpdateRequest;
import com.lectory.user.repository.UserRepository;
import com.lectory.user.repository.UserTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserTypeRepository userTypeRepository;

    @Transactional
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

    @Transactional(readOnly = true)
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 유저입니다."));
    }

    //마이페이지 정보 리턴
    @Transactional(readOnly = true)
    public UserMypageResponse getUserMypage(User user){
        return UserMypageResponse.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .userType(user.getUserType().getUserType())
                .subscriptionStartDate(user.getSubscriptionStartDate())
                .subscriptionEndDate(user.getSubscriptionEndDate())
                .build();
    }

    //회원 수정 로직 구현
    @Transactional
    public void updateUserInfo(User user, UserUpdateRequest request) {
        // 닉네임 수정
        if (StringUtils.hasText(request.getNickname()) &&
                !request.getNickname().equals(user.getNickname())) {

            if (request.getNickname().length() < 2 || request.getNickname().length() > 20) {
                throw new IllegalArgumentException("닉네임은 2자 이상 20자 이하로 입력하세요.");
            }

            if (!request.getNickname().matches("^[a-zA-Z0-9가-힣]+$")) {
                throw new IllegalArgumentException("닉네임은 특수문자를 포함할 수 없습니다.");
            }

            if (userRepository.existsByNickname(request.getNickname())) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }

            user.setNickname(request.getNickname());
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

            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new IllegalArgumentException("새로운 비밀번호는 기존 비밀번호와 달라야 합니다.");
            }

            String encodedPassword = passwordEncoder.encode(request.getPassword());
            user.setPassword(encodedPassword);
        }
        userRepository.save(user);
    }

    //일반 유저는 하드 탈퇴 전문가는 소프트 탈퇴 로직 구현
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("유저를 찾을 수 없습니다."));

        String userType = user.getUserType().getUserType();

        if("EXPERT".equals(userType)){
            user.setIsDeleted(true);
            user.setDeletedAt(LocalDateTime.now());

            Expert expert = user.getExpert();
            if(expert != null){
                expert.setApprovalStatus(Expert.ApprovalStatus.REJECTED);
            }
        } else {
            userRepository.delete(user);
        }
    }

    //구독에 따른 유저 업데이트
    @Transactional
    public void updatePaidUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        var paidType = userTypeRepository.findById("PAID").orElseThrow(() -> new IllegalStateException("유료 회원 권한이 존재하지 않습니다."));

        LocalDateTime now = LocalDateTime.now();

        //첫 결제
        if ("FREE".equals(user.getUserType().getUserType()) || user.getSubscriptionStartDate() == null) {
            user.setSubscriptionStartDate(now);
            user.setSubscriptionEndDate(now.plusMinutes(3));
        } else if (user.getSubscriptionEndDate() != null && user.getSubscriptionEndDate().isAfter(now)
        ) {
            // 정기 결제 중에 연장
            user.setSubscriptionEndDate(user.getSubscriptionEndDate().plusMinutes(3));
        } else {
            // 구독 만료 시 재결제 (자동 연장이고 구독 취소 기능 만들거니 안쓸테지만 일단 추가)
            user.setSubscriptionStartDate(now);
            user.setSubscriptionEndDate(now.plusMinutes(3));
        }

        user.setUserType(paidType);
        userRepository.save(user);
    }

    //구독 취소 시 변경
    @Transactional
    public void cancelSubscription(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        var freeType = userTypeRepository.findById("FREE").orElseThrow(() -> new IllegalStateException("무료 유저 타입이 존재하지 않습니다."));

        user.setUserType(freeType);

        userRepository.save(user);
    }

}