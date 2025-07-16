package com.lectory.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExpertMypageResponse {
    private String email;
    private String nickname;
    private String userType;
    private String portfolioFileUrl;
    private String profileImageUrl;
}
