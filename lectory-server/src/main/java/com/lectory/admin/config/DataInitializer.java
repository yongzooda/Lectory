package com.lectory.admin.config;

import com.lectory.common.domain.user.User;
import com.lectory.common.domain.user.UserType;
import com.lectory.user.repository.UserRepository;
import com.lectory.user.repository.UserTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserTypeRepository userTypeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           UserTypeRepository userTypeRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userTypeRepository = userTypeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@example.com")) {
            // "ADMIN" 권한을 DB에서 조회
            UserType adminType = userTypeRepository.findById("ADMIN")
                    .orElseThrow(() -> new IllegalStateException("ADMIN 권한이 user_type 테이블에 존재하지 않습니다."));

            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setNickname("ADMIN");
            admin.setPassword(passwordEncoder.encode("admin1234"));
            admin.setUserType(adminType); // UserType 객체 설정

            userRepository.save(admin);
        }
    }
}