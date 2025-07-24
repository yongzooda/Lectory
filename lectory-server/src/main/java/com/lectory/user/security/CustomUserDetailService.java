package com.lectory.user.security;

import com.lectory.common.domain.user.User;
import com.lectory.common.domain.user.Expert;
import com.lectory.user.repository.ExpertRepository;
import com.lectory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;
    private final ExpertRepository expertRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        // 전문가라면 승인 상태 확인
        if (user.getUserType().getUserType().equals("EXPERT")) {
            Expert expert = expertRepository.findByUser(user)
                    .orElseThrow(() -> new BadCredentialsException("전문가 정보가 존재하지 않습니다."));

            switch (expert.getApprovalStatus()) {
                case PENDING -> throw new BadCredentialsException("승인 대기 중인 전문가입니다.");
                case REJECTED -> throw new BadCredentialsException("승인 거부된 전문가입니다.");
                default -> {
                    // APPROVED → 통과
                }
            }
        }

        return new CustomUserDetail(user);
    }
}
