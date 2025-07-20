// lectory-client/src/pages/contentlibrary/student/EnrollResult.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * 수강신청 완료 페이지
 * URL: /library/:lectureRoomId/enroll-result
 */
const EnrollResult = () => {
  const { lectureRoomId } = useParams();
  const navigate          = useNavigate();

  /* ─── 이동 핸들러 ─── */
  const goDetail = () => {
    navigate(`/library/${lectureRoomId}`);
  };

  const goList = () => {
    navigate('/library');
  };

  /* ─── 렌더 ─── */
  return (
    <div className="container mx-auto p-8 text-center space-y-6">
      <h1 className="text-3xl font-bold">수강신청이 완료되었습니다!</h1>
      <p className="text-lg text-gray-700">
        강의 목록과 수강평을 확인하실 수 있습니다.
      </p>

      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={goDetail}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
        >
          강의실로 이동
        </button>
        <button
          onClick={goList}
          className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded"
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default EnrollResult;
