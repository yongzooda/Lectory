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

import com.lectory.common.domain.pay.KakaoApproveResponse;
import com.lectory.common.domain.pay.KakaoReadyResponse;
import com.lectory.common.domain.pay.PayHistory;
import com.lectory.common.domain.pay.RegularPay;
import com.lectory.common.domain.user.User;
import com.lectory.common.domain.user.UserType;
import com.lectory.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class KakaoPayService {

    @Autowired
    private PayHistoryService payHistoryService;

    @Autowired
    private RegularPayService regularPayService;

    @Autowired
    private UserService userService;

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

        log.info("카카오페이 결제 준비 요청");
        log.info(kakaoReadyResponse.getNext_redirect_pc_url());

        return kakaoReadyResponse;
    }

    @Scheduled(cron = "0 * * * * *") // 새벽 4시 예정, 현재 매 분마다 요청중
    public void KakaoRegularReady() { // 정기 결제

        List<RegularPay> regularPays = regularPayService.getAllRegularPays();

        LocalDateTime now = LocalDateTime.now();

        for (var regularpay : regularPays) {

            Map<String, Object> body = new HashMap<>();
            LocalDateTime endDate = regularpay.getUser().getSubscriptionEndDate();

            if (endDate.isAfter(now.plusMinutes(1))) {
                System.out.println("아직아님");
                continue;
            } // 정식배포시 1달 뒤로 설정할 예정
            if (regularpay.isCanceled()) {
                regularPayService.deleteByUser_UserId(regularpay.getUser().getUserId());
                User user = regularpay.getUser();
                UserType userType = user.getUserType();
                userType.setTypeName("FREE");
                user.setUserType(userType);
                userService.save(user);
                continue;
            }

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

            log.info(" 정기 결제 준비 요청 완료 :" + LocalDateTime.now());

            kaKaoRegularApprove(kakaoReadyResponse, regularpay.getUser().getUserId(), regularpay.getSid());
        }
    }

    @Transactional
    public void kaKaoRegularApprove(KakaoReadyResponse kakaoReadyResponse, Long userId, String sid) { // 결제 승인

        Map<String, Object> body = new HashMap<>();

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

        if (response == null) {
            log.error("에러발생");
            return;
        }

        /*
         * 현재 userService가 없어서 레포지토리로 임시사용중
         */

        User user = userService.getUser(userId);
        user.setSubscriptionEndDate(user.getSubscriptionEndDate().plusMinutes(3)); // 3분뒤로 임시 설정
        user.setUserType(user.getUserType());
        userService.save(user);

        PayHistory payHistory = PayHistory.builder().user(user).paidAt(LocalDateTime.now()).build();
        payHistoryService.save(payHistory);

        RegularPay regularPay = regularPayService.findByUser_UserId(userId);
        regularPay.setAid(response.getAid());
        regularPay.setTid(response.getTid());
        regularPay.setSid(response.getSid());
        regularPayService.save(regularPay);

        log.info("정기 결제 승인 요청 완료 :" + LocalDateTime.now());

    }

    @Transactional
    public KakaoApproveResponse kaKaoApprove(String pgToken, Long userId) { // 결제 승인

        Map<String, Object> body = new HashMap<>();

        log.info("카카오페이 결제 승인 요청");
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

        if (response == null) {
            log.error("에러발생");
            return null;
        }

        /*
         * 현재 userService가 없어서 레포지토리로 임시사용중
         */
        User user = userService.getUser(userId);
        user.setSubscriptionStartDate(LocalDateTime.now());
        user.setSubscriptionEndDate(LocalDateTime.now().plusMinutes(3));
        UserType userType = user.getUserType();
        userType.setTypeName("PAID");
        user.setUserType(userType);
        userService.save(user);

        PayHistory payHistory = PayHistory.builder().user(user).paidAt(LocalDateTime.now()).build();
        payHistoryService.save(payHistory);

        if (regularPayService.findByUser_UserId(userId) == null) {
            RegularPay regularPay = RegularPay.builder()
                    .user(user)
                    .aid(response.getAid())
                    .tid(response.getTid())
                    .sid(response.getSid())
                    .canceled(false)
                    .build();
            regularPayService.save(regularPay);
        } else {
            RegularPay regularPay = regularPayService.findByUser_UserId(userId);
            regularPay.setAid(response.getAid());
            regularPay.setTid(response.getTid());
            regularPay.setSid(response.getSid());
            regularPayService.save(regularPay);
        }
        return response;
    }

    public void kakaopaySubscriptionCancel(Long userId) {

        log.info("정기 결제 취소 요청" + LocalDateTime.now());
        RegularPay regularPay = regularPayService.findByUser_UserId(userId);
        regularPay.setCanceled(true);
        regularPayService.save(regularPay);

    }

}
