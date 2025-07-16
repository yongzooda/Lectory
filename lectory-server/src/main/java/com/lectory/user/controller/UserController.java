package com.lectory.user.controller;

import com.lectory.user.dto.UserMypageResponse;
import com.lectory.user.dto.UserSignUpRequest;
import com.lectory.user.dto.UserUpdateRequest;
import com.lectory.user.security.CustomUserDetail;
import com.lectory.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@Valid @RequestBody UserSignUpRequest request) {
        userService.register(request);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @GetMapping("/mypage")
    public ResponseEntity<UserMypageResponse> myPage(@AuthenticationPrincipal CustomUserDetail userDetail){
        UserMypageResponse response = userService.getUserMypage(userDetail.getUser());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateMyInfo(@AuthenticationPrincipal CustomUserDetail userDetail, @Valid @RequestBody UserUpdateRequest request) {
        userService.updateUserInfo(userDetail.getUser(), request);
        return ResponseEntity.ok("회원 정보가 수정되었습니다.");
    }

}
