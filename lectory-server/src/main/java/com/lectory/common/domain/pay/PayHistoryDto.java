package com.lectory.common.domain.pay;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PayHistoryDto {
    private Long userId;
    private LocalDateTime paidAt;

}
