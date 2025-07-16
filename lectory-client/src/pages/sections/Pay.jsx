import React, { use, useEffect, useState } from "react";
import "../../assets/css/pay.css";
import { preparePayment } from "../../api/payApi";

export const Pay = () => {
  const [amount, setAmount] = useState(10000);
  const [productName] = useState("1개월 구독");

  const handleClick = async () => {
    try {
      const response = await preparePayment();
      if (response.data.next_redirect_pc_url) {
        window.location.href = response.data.next_redirect_pc_url;
      }
    } catch (err) {
      console.error("결제 준비 실패:", err);
      alert("결제 요청 실패");
    }
  };

  return (
    <div className="pay-page">
      <div className="pay-section">
        <label className="pay-label">상품명</label>
        <div className="pay-static-text">{productName}</div>

        <label className="pay-label">결제 금액</label>
        <div className="pay-static-text">{amount.toLocaleString()} 원</div>
        <button className="pay-button" onClick={handleClick}>
          결제하기
        </button>
      </div>
    </div>
  );
};

export default Pay;
