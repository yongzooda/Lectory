package com.lectory.user.controller;

import com.lectory.user.dto.JwtResponse;
import com.lectory.user.dto.LoginRequest;
import com.lectory.user.security.CustomUserDetail;
import com.lectory.user.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();

            String email = userDetail.getUsername();
            Long userId = userDetail.getUser().getUserId();
            String role = userDetail.getUser().getUserType().getUserType(); // role 추가

            String accessToken = jwtUtil.generateToken(email, userId, role); // role 추가
            return ResponseEntity.ok(new JwtResponse(accessToken));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

}
