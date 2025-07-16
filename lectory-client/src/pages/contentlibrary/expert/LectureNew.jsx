// lectory-client/src/pages/contentlibrary/expert/LectureNew.jsx
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createLecture } from '../../../api/expertApi';

import LectureForm from '../../../components/expert/LectureForm';

/**
 * 전문가용 – 강의실 신규 생성 페이지
 * URL: /library/expert/new?expertId=#
 */
const LectureNew = () => {
  const [searchParams] = useSearchParams();
  const expertId       = searchParams.get('expertId');
  const navigate       = useNavigate();

  /* ─── 저장 ─── */
  const handleSave = async (payload) => {
    try {
      const res = await createLecture({ expertId, ...payload });
      const { lectureRoomId } = res.data;               // 백엔드가 id 반환
      alert('강의실이 생성되었습니다.');
      navigate(`/library/expert/${lectureRoomId}?expertId=${expertId}`);
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
        onCancel={() => navigate(`/library/expert?expertId=${expertId}`)}
      />
    </div>
  );
};

export default LectureNew;
