package com.lectory.pay.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.RegularPay;

public interface RegularPayRepository extends JpaRepository<RegularPay, Long> {

    public Optional<RegularPay> findByUserId(Long userId);
}
