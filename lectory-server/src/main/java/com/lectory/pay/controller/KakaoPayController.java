package com.lectory.pay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import com.lectory.common.domain.pay.KakaoApproveResponse;
import com.lectory.common.domain.pay.KakaoReadyResponse;
import com.lectory.pay.service.KakaoPayService;
import com.lectory.user.repository.UserRepository;
import com.lectory.user.security.CustomUserDetail;
import com.lectory.user.service.UserService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/pay")
public class KakaoPayController {
    @Autowired
    private KakaoPayService kakaoPayService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/ready")
    public KakaoReadyResponse kakaoReady(@AuthenticationPrincipal CustomUserDetail user) { // 로그인 추가시 해당 유저 userId 추가 예정
        Long userId = userRepository.findByEmail(user.getUsername()).orElse(null).getUserId();
        KakaoReadyResponse response = kakaoPayService.kaKaoReady(userId);
        return response;
    }

    @GetMapping("/fail")
    public void fail() {
    }

    @GetMapping("/success")
    public RedirectView success(@AuthenticationPrincipal CustomUserDetail user,
            @RequestParam("userId") Long userId,
            @RequestParam("pg_token") String pgToken) { // 마찬가지로 로그인 추가시 해당 유저 userId 추가 예정
        KakaoApproveResponse response = kakaoPayService.kaKaoApprove(pgToken, userId);
        String redirectUrl = UriComponentsBuilder
                .fromUriString("http://localhost:5173/pay/success")
                .build()
                .toUriString();

        return new RedirectView(redirectUrl);
    }

    @GetMapping("/cancel")
    public int subscriptionCancel(@AuthenticationPrincipal CustomUserDetail user) {
        Long id = userRepository.findByEmail(user.getUsername()).orElse(null).getUserId();
        System.out.println("구독 취소 요청, userId: " + id);
        kakaoPayService.kakaopaySubscriptionCancel(id);
        return 0;
    }

}
