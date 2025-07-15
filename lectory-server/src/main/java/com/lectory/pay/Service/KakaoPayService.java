package com.lectory.pay.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.lectory.common.domain.KakaoApproveResponse;
import com.lectory.common.domain.KakaoReadyResponse;
import com.lectory.common.domain.PayHistory;
import com.lectory.common.domain.RegularPay;
import com.lectory.pay.Repository.PayHistoryRepository;
import com.lectory.pay.Repository.RegularPayRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class KakaoPayService {

    @Autowired
    private PayHistoryRepository payHistoryRepository;

    @Autowired
    private RegularPayRepository regularPayRepository;

    @Value("${kakaopay.cid}")
    private String cid;
    @Value("${kakaopay.secretKey}")
    private String secretKey;

    private KakaoReadyResponse kakaoReadyResponse;
    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders getHeader() {
        HttpHeaders headers = new HttpHeaders();
        String auth = "SECRET_KEY " + secretKey;
        headers.set("Authorization", auth);
        headers.set("Content-Type", "application/json");
        return headers;
    }

    public KakaoReadyResponse kaKaoReady(Long userId) { // 단건 결제 요청
        System.out.println("카카오페이 결제 준비 요청");
        Map<String, Object> body = new HashMap<>();
        body.put("cid", cid);
        body.put("partner_order_id", "order_id");
        body.put("partner_user_id", "user_id");
        body.put("item_name", "구독 1개월");
        body.put("quantity", 1);
        body.put("total_amount", 1000000000);
        body.put("tax_free_amount", 0);
        body.put("approval_url", "http://localhost:8888/pay/success");
        body.put("cancel_url", "http://localhost:8888/pay/cancel");
        body.put("fail_url", "http://localhost:8888/pay/fail");
        HttpHeaders headers = getHeader();
        kakaoReadyResponse = restTemplate.postForObject(
                "https://open-api.kakaopay.com/online/v1/payment/ready",
                new HttpEntity<>(body, headers),
                KakaoReadyResponse.class);
        kakaoReadyResponse.setUserId(userId);
        return kakaoReadyResponse;
    }

    @Scheduled(cron = "0 * * * * *") // 새벽 4시 예정, 현재 매 분마다 요청중
    public void KakaoRegularReady() { // 정기 결제
        System.out.println("정기 결제 준비 요청" + LocalDateTime.now());
        List<RegularPay> regularPays = regularPayRepository.findAll();
        for (var regularpay : regularPays) {
            /*
             * 
             * 
             * regularpay.userid 갖고와서 구독기간 확인 후, 진행하는 로직 추가 예정
             * 
             * 
             */
            Map<String, Object> body = new HashMap<>();
            body.put("cid", cid);
            body.put("sid", regularpay.getSid());
            body.put("partner_order_id", "order_id");
            body.put("partner_user_id", "user_id");
            body.put("item_name", "구독 1개월");
            body.put("quantity", 1);
            body.put("total_amount", 1000000000);
            body.put("tax_free_amount", 0);
            body.put("approval_url", "http://localhost:8888/pay/success");
            body.put("cancel_url", "http://localhost:8888/pay/cancel");
            body.put("fail_url", "http://localhost:8888/pay/fail");
            HttpHeaders headers = getHeader();
            kakaoReadyResponse = restTemplate.postForObject(
                    "https://open-api.kakaopay.com/online/v1/payment/ready",
                    new HttpEntity<>(body, headers),
                    KakaoReadyResponse.class);
            System.out.println("정기 결제 준비 요청" + kakaoReadyResponse.getTid() + " sid: " + regularpay.getSid());
            kaKaoRegularApprove(kakaoReadyResponse, regularpay.getUserId(), regularpay.getSid());
        }
    }

    @Transactional
    public void kaKaoRegularApprove(KakaoReadyResponse kakaoReadyResponse, Long userId, String sid) { // 결제 승인
        Map<String, Object> body = new HashMap<>();
        System.out.println("결제 승인");
        body.put("cid", cid);
        body.put("sid", sid);
        body.put("partner_order_id", "order_id");
        body.put("partner_user_id", "user_id");
        body.put("item_name", "구독 1개월");
        body.put("quantity", 1);
        body.put("total_amount", 1000000000);
        body.put("tax_free_amount", 0);
        HttpHeaders headers = getHeader();
        KakaoApproveResponse response = restTemplate.postForObject(
                "https://open-api.kakaopay.com/online/v1/payment/subscription",
                new HttpEntity<>(body, headers),
                KakaoApproveResponse.class);
        PayHistory payHistory = PayHistory.builder().userId(userId).paidAt(LocalDateTime.now()).build();
        payHistoryRepository.save(payHistory);
        if (response == null) {
            log.error("에러발생");
            return;
        }
        if (regularPayRepository.findByUserId(userId).isEmpty()) {
            RegularPay regularPay = RegularPay.builder()
                    .userId(userId)
                    .aid(response.getAid())
                    .tid(response.getTid())
                    .sid(response.getSid())
                    .build();
            regularPayRepository.save(regularPay);
        } else {
            RegularPay regularPay = regularPayRepository.findByUserId(userId).get();
            regularPay.setAid(response.getAid());
            regularPay.setTid(response.getTid());
            regularPay.setSid(response.getSid());
            regularPayRepository.save(regularPay);
        }
        System.out.println("정기결제 승인" + LocalDateTime.now() + " userId: " + userId
                + " aid: " + response.getAid() + " sid: " + response.getSid());
    }

    @Transactional
    public KakaoApproveResponse kaKaoApprove(String pgToken, Long userId) { // 결제 승인
        Map<String, Object> body = new HashMap<>();
        System.out.println("결제 승인");
        body.put("cid", cid);
        body.put("tid", kakaoReadyResponse.getTid());
        body.put("partner_order_id", "order_id");
        body.put("partner_user_id", "user_id");
        body.put("pg_token", pgToken);
        HttpHeaders headers = getHeader();
        KakaoApproveResponse response = restTemplate.postForObject(
                "https://open-api.kakaopay.com/online/v1/payment/approve",
                new HttpEntity<>(body, headers),
                KakaoApproveResponse.class);
        PayHistory payHistory = PayHistory.builder().userId(userId).paidAt(LocalDateTime.now()).build();
        payHistoryRepository.save(payHistory);
        if (response == null) {
            log.error("에러발생");
            return null;
        }
        if (regularPayRepository.findByUserId(userId).isEmpty()) {
            RegularPay regularPay = RegularPay.builder()
                    .userId(userId)
                    .aid(response.getAid())
                    .tid(response.getTid())
                    .sid(response.getSid())
                    .build();
            regularPayRepository.save(regularPay);
        } else {
            RegularPay regularPay = regularPayRepository.findByUserId(userId).get();
            regularPay.setAid(response.getAid());
            regularPay.setTid(response.getTid());
            regularPay.setSid(response.getSid());
            regularPayRepository.save(regularPay);
        }
        return response;
    }

}
