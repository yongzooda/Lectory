package com.lectory.pay.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lectory.common.domain.pay.RegularPay;

public interface RegularPayRepository extends JpaRepository<RegularPay, Long> {

    public Optional<RegularPay> findByUser_UserId(Long userId);

    public void deleteByUser_UserId(Long userId);
}
