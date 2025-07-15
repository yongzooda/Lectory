package com.lectory.common.domain.pay;

import lombok.Data;

@Data

public class KakaoReadyResponse {
    private String tid;
    private String next_redirect_mobile_url;
    private String next_redirect_pc_url;
    private String created_at;
    private Long userId;

}
