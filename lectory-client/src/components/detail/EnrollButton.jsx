// lectory-client/src/components/detail/EnrollButton.jsx
import styles from '../../assets/css/contentLibrary.module.css';
import React, { useState } from 'react';

/**
 * 수강신청 버튼
 *
 * props
 *  • onEnroll() : Promise<void>  ― 필수. 클릭 시 호출
 *  • disabled   : Boolean        ― 이미 신청했을 때 비활성 (기본 false)
 *  • isPaid     : Boolean        ― 유료 강의실이면 true (버튼 라벨 표시용)
 */
const EnrollButton = ({ onEnroll, disabled = false, isPaid = false }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    try {
      setLoading(true);
      await onEnroll();               // 부모에서 예외 처리
    } finally {
      setLoading(false);
    }
  };

  const label = loading
    ? '신청 중…'
    : isPaid
    ? '유료 강의 수강신청'
    : '수강신청';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`w-full md:w-auto px-6 py-3 rounded text-white font-medium transition
        ${
          disabled || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : isPaid
            ? 'bg-rose-600 hover:bg-rose-700'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
    >
      {label}
    </button>
  );
};

export default EnrollButton;
