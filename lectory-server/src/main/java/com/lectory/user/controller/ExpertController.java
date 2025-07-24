package com.lectory.user.controller;

import com.lectory.common.domain.user.Expert;
import com.lectory.user.dto.ExpertMypageResponse;
import com.lectory.user.dto.ExpertSignUpRequest;
import com.lectory.user.dto.ExpertUpdateRequest;
import com.lectory.user.dto.UserUpdateRequest;
import com.lectory.user.security.CustomUserDetail;
import com.lectory.user.service.ExpertService;
import com.lectory.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/experts/")
@RequiredArgsConstructor
public class ExpertController {
    private final ExpertService expertService;
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> expertSignUp(@Valid @RequestBody ExpertSignUpRequest request){
        expertService.registerExpert(request);
        return ResponseEntity.ok("전문가 회원가입이 완료되었습니다.");
    }

    @GetMapping("/mypage")
    public ResponseEntity<ExpertMypageResponse> expertMyPage(@AuthenticationPrincipal CustomUserDetail userDetail){
        ExpertMypageResponse response = expertService.getExpertMypage(userDetail.getUser());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/mypage")
    public ResponseEntity<String> updateExpertInfo(@AuthenticationPrincipal CustomUserDetail userDetail, @Valid @RequestBody ExpertUpdateRequest request) {
        expertService.updateExpertInfo(userDetail.getUser(), request);
        return ResponseEntity.ok("회원 정보가 수정되었습니다.");
    }

}
