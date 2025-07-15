package com.lectory.common.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;

@Table(name = "pay_history")
@Entity
@Data
@Builder
public class PayHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pay_history_id")
    private Long payHistoryId;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "paid_at")
    private LocalDateTime paidAt;

}
