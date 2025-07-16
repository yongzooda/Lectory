package com.lectory.pay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import com.lectory.common.domain.pay.KakaoApproveResponse;
import com.lectory.common.domain.pay.KakaoReadyResponse;
import com.lectory.pay.service.KakaoPayService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/pay")
public class KakaoPayController {
    @Autowired
    private KakaoPayService kakaoPayService;

    @GetMapping("/ready")
    public KakaoReadyResponse kakaoReady() { // 로그인 추가시 해당 유저 userId 추가 예정
        KakaoReadyResponse response = kakaoPayService.kaKaoReady(1L); // 임시 유저 1 생성 후 진행
        return response;
    }

    @GetMapping("/cancel")
    public void cancel() {
    }

    @GetMapping("/fail")
    public void fail() {
    }

    @GetMapping("/success")
    public RedirectView success(@RequestParam("pg_token") String pgToken) { // 마찬가지로 로그인 추가시 해당 유저 userId 추가 예정
        KakaoApproveResponse response = kakaoPayService.kaKaoApprove(pgToken, 1L); // 임시 유저 1 생성 후 진행
        String redirectUrl = UriComponentsBuilder
                .fromUriString("http://localhost:5173/pay/success")
                .build()
                .toUriString();

        return new RedirectView(redirectUrl);
    }

    @GetMapping("/cancel/{id}")
    public void subscriptionCancel(@PathVariable("id") Long id) {
        kakaoPayService.kakaopaySubscriptionCancel(id);
    }

}
