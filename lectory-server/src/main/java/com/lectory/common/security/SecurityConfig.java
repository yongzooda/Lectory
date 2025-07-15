package com.lectory.common.security;

import com.lectory.user.security.CustomUserDetailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// Spring Security 6 부터 WebSecurityConfigurerAdapter 대신 SecurityFilterChain 사용
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailService userDetailService;

    public SecurityConfig(CustomUserDetailService userDetailsService) {
        this.userDetailService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1) 로그인·로그아웃·Swagger 엔드포인트 전부 허용
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/login",              // 로그인 폼 접근
                                "/logout",             // 로그아웃 엔드포인트
                                "/error",            // ← 추가!
                                "/api/users/signup",
                                "/v3/api-docs/**",     // OpenAPI JSON
                                "/swagger-ui.html",    // Swagger UI redirect 페이지
                                "/swagger-ui/**",      // Swagger 정적 리소스
                                "/webjars/**",         // Swagger UI 의존 웹자바
                                "/library/**"
                        ).permitAll()
                        // 2) 그 외 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                // 3) 커스텀 로그인 페이지 설정 (permitAll 은 GET/POST /login 모두 허용)
                .formLogin(
                        Customizer.withDefaults()
                )
                // 4) 로그아웃 허용
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                )
                // 5) 개발 편의상 CSRF 비활성화 (필요시 켜세요)
                .csrf(csrf -> csrf.disable())
        ;

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}