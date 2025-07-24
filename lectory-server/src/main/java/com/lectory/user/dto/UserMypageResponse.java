package com.lectory.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserMypageResponse {
    private String email;
    private String nickname;
    private String userType;
    private LocalDateTime subscriptionStartDate;
    private LocalDateTime subscriptionEndDate;

}
