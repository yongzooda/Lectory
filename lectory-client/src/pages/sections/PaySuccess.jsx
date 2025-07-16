import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../assets/css/pay.css";

export const PaySuccess = () => {
  const [now, setNow] = useState(new Date());

  const handleClick = () => {
    window.location.href = "/";
  };
  return (
    <div className="pay-page">
      <div className="pay-section">
        <label className="pay-label">결제완료</label>
        <label className="pay-label">결제내역 : 1개월 구독</label>
        <label className="pay-label">결제일시 : {now.toString()}</label>
        <button className="pay-button" onClick={handleClick}>
          홈으로
        </button>
      </div>
    </div>
  );
};

export default PaySuccess;
