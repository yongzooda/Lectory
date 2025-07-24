// lectory-client/src/pages/contentlibrary/expert/LectureNew.jsx
import styles from '../../../assets/css/contentLibrary.module.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createLecture } from '../../../api/expertApi';

import LectureForm from '../../../components/expert/LectureForm';

/**
 * 전문가용 – 강의실 신규 생성 페이지
 * URL: /library/expert/new
 */
const LectureNew = () => {
  const navigate = useNavigate();

  /* ─── 저장 ─── */
  const handleSave = async (payload) => {
    try {
      // expertId는 JWT 인증을 통해 백엔드에서 자동으로 가져옵니다.
      const res = await createLecture(payload);
      const { lectureRoomId } = res.data;
      alert('강의실이 생성되었습니다.');
      // expertId 쿼리 없이 전문가 홈으로 이동합니다.
      navigate(`/library/expert/${lectureRoomId}`);
    } catch (err) {
      console.error(err);
      alert('생성 실패');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">새 강의실 생성</h1>

      <LectureForm
        onSave={handleSave}
        onCancel={() => navigate('/library/expert')}
      />
    </div>
  );
};

export default LectureNew;
