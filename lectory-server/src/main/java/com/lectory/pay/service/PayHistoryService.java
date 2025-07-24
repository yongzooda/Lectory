package com.lectory.pay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lectory.common.domain.pay.PayHistory;
import com.lectory.pay.repository.PayHistoryRepository;

@Service
public class PayHistoryService {
    @Autowired
    private PayHistoryRepository payHistoryRepository;

    public void save(PayHistory payHistory) {
        payHistoryRepository.save(payHistory);
    }

}
