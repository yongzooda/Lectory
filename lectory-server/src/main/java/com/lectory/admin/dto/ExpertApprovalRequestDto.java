package com.lectory.admin.dto;

import lombok.Getter;

@Getter
public class ExpertApprovalRequestDto {
    private Long expertId;
    private String status; // "APPROVED" or "REJECTED"
}