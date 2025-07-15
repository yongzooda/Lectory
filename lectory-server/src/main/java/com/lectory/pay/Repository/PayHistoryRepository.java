package com.lectory.pay.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.pay.PayHistory;

public interface PayHistoryRepository extends JpaRepository<PayHistory, Long> {

}
