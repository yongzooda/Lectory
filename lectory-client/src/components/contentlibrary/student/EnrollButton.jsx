import React from 'react';

/**
 * EnrollButton 컴포넌트
 * @param {{ onEnroll: () => void }} props
 */
const EnrollButton = ({ onEnroll }) => {
  return (
    <div className="enroll-button flex justify-center mt-6">
      <button
        onClick={onEnroll}
        className="btn-primary px-6 py-2 rounded-lg"
      >
        수강신청하기
      </button>
    </div>
  );
};

export default EnrollButton;
