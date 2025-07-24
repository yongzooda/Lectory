package com.lectory.common.domain.pay;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegularPayDto {
    private Long userId;
    private String aid;
    private String tid;
    private String sid;
}
