package com.lectory.pay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.lectory.common.domain.pay.KakaoApproveResponse;
import com.lectory.common.domain.pay.KakaoReadyResponse;
import com.lectory.pay.service.KakaoPayService;

@Controller
@RequestMapping("/pay")
public class KakaoPayController {
    @Autowired
    private KakaoPayService kakaoPayService;

    @GetMapping("/ready")
    public String kakaoReady() { // 로그인 추가시 해당 유저 userId 추가 예정
        KakaoReadyResponse response = kakaoPayService.kaKaoReady(1L); // 임시 유저 1 생성 후 진행
        if (response == null) {
            return "pay_fail";
        }
        return "pay_ready";
    }

    @GetMapping("/cancel")
    public String cancel() {
        return "pay_cancel";
    }

    @GetMapping("/fail")
    public String fail() {
        return "pay_fail";
    }

    @GetMapping("/success")
    public String success(@RequestParam("pg_token") String pgToken) { // 마찬가지로 로그인 추가시 해당 유저 userId 추가 예정
        KakaoApproveResponse response = kakaoPayService.kaKaoApprove(pgToken, 1L); // 임시 유저 1 생성 후 진행
        if (response == null) {
            return "pay_fail";
        }
        return "pay_success";
    }

    @GetMapping("/cancel/{id}")
    public String subscriptionCancel(@PathVariable("id") Long id) {
        kakaoPayService.kakaopaySubscriptionCancel(id);
        return "main";
    }

}
