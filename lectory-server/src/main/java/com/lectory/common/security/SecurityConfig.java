package com.lectory.common.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// Spring Security 6 부터 WebSecurityConfigurerAdapter 대신 SecurityFilterChain 사용
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1) 로그인·로그아웃·Swagger 엔드포인트 전부 허용
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/login",              // 로그인 폼 접근
                                "/logout",             // 로그아웃 엔드포인트
                                "/error",            // ← 추가!
                                "/v3/api-docs/**",     // OpenAPI JSON
                                "/swagger-ui.html",    // Swagger UI redirect 페이지
                                "/swagger-ui/**",      // Swagger 정적 리소스
                                "/webjars/**" ,         // Swagger UI 의존 웹자바
                                "/library/**"
                        ).permitAll()
                        // 2) 그 외 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                // 3) 커스텀 로그인 페이지 설정 (permitAll 은 GET/POST /login 모두 허용)
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/swagger-ui/index.html", true)
                        .permitAll()
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
}