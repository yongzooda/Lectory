package com.lectory.admin.dto;

import com.lectory.common.domain.user.Expert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter@NoArgsConstructor
@AllArgsConstructor
public class ExpertApprovalRequestDto {
    public Long expertId;
    private Expert.ApprovalStatus status; // "APPROVED" or "PENDING"
}