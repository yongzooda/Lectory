package com.lectory.pay.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lectory.common.domain.pay.PayHistory;
import com.lectory.pay.Repository.PayHistoryRepository;

@Service
public class PayHistoryService {
    @Autowired
    private PayHistoryRepository payHistoryRepository;

    public void save(PayHistory payHistory) {
        payHistoryRepository.save(payHistory);
    }

}
