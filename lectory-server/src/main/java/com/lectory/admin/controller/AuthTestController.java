package com.lectory.admin.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthTestController {

    @GetMapping("/check-auth")
    public String checkAuthentication() {
        // 1. SecurityContext에서 Authentication 객체 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return "인증 정보가 없습니다.";
        }

        // 2. Principal(사용자 정보) 확인
        Object principal = authentication.getPrincipal();
        System.out.println("Principal: " + principal.toString());

        // 3. 권한(Authorities) 목록 확인
        StringBuilder authoritiesBuilder = new StringBuilder();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            authoritiesBuilder.append(authority.getAuthority()).append(" ");
        }

        String authorities = authoritiesBuilder.toString().trim();
        System.out.println("Authorities: " + authorities);

        // 4. "ADMIN" 권한이 있는지 직접 확인
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ADMIN"));

        if (isAdmin) {
            return "사용자: " + principal + " / 권한: " + authorities + " -> ADMIN 권한을 가지고 있습니다. ✅";
        } else {
            return "사용자: " + principal + " / 권한: " + authorities + " -> ADMIN 권한이 없습니다. ❌";
        }
    }
}