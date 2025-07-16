package com.lectory.user.controller;

import com.lectory.user.dto.ExpertSignUpRequest;
import com.lectory.user.service.ExpertService;
import com.lectory.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
