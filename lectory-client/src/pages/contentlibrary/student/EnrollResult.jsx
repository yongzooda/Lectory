import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

const EnrollResult = () => {
  const { lectureRoomId } = useParams();
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('memberId');
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/library/${lectureRoomId}?memberId=${memberId}`);
  };

  const goToList = () => {
    navigate(`/library?memberId=${memberId}`);
  };

  return (
    <div className="enroll-result container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">수강신청 완료!</h1>
      <p className="mb-6 text-lg">해당 강의실의 강의 목록과 후기를 확인할 수 있습니다.</p>
      <button
        onClick={goToDetail}
        className="btn-primary mr-4"
      >
        강의 보러 가기
      </button>
      <button
        onClick={goToList}
        className="btn-outline"
      >
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default EnrollResult;
