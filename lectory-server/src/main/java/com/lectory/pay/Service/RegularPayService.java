package com.lectory.pay.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lectory.common.domain.pay.RegularPay;
import com.lectory.pay.Repository.RegularPayRepository;

@Service
public class RegularPayService {
    @Autowired
    private RegularPayRepository regularPayRepository;

    public List<RegularPay> getAllRegularPays() {
        return regularPayRepository.findAll();
    }

    public void deleteByUser_UserId(Long userId) {
        regularPayRepository.deleteByUser_UserId(userId);
    }

    public void save(RegularPay regularPay) {
        regularPayRepository.save(regularPay);
    }

    public RegularPay findByUser_UserId(Long userId) {
        return regularPayRepository.findByUser_UserId(userId).orElse(null);
    }

}
