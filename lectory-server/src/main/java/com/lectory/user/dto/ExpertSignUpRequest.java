package com.lectory.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertSignUpRequest {

    @Email(message = "올바른 이메일 형식을 입력하세요.")
    @NotBlank(message = "이메일은 필수 입력값입니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력하세요.")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,20}$",
            message = "비밀번호는 영문자, 숫자, 특수문자를 모두 포함해야 합니다."
    )
    private String password;

    @NotBlank(message = "비밀번호 확인은 필수 입력값입니다.")
    @Size(min = 8, max = 20, message = "비밀번호 확인은 8자 이상 20자 이하로 입력하세요.")
    private String passwordConfirm;

    @NotBlank(message = "닉네임은 필수 입력값입니다.")
    @Size(min = 2, max = 20, message = "닉네임은 2자 이상 20자 이하로 입력하세요.")
    @Pattern(regexp = "^[a-zA-Z0-9가-힣]+$", message = "닉네임은 특수문자를 포함할 수 없습니다.")
    private String nickname;

    private String portfolioFileUrl;
    private String profileImageUrl;
}
