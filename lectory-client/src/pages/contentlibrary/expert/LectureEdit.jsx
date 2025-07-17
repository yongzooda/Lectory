// lectory-client/src/pages/contentlibrary/expert/LectureEdit.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  getLectureDetail,
  updateLecture,
} from '../../../api/expertApi';

import LectureForm from '../../../components/expert/LectureForm';

/**
 * 전문가용 – 강의실 수정 단독 페이지
 * URL: /library/expert/:lectureRoomId/edit?expertId=#
 */
const LectureEdit = () => {
  const { lectureRoomId }   = useParams();
  const [searchParams]      = useSearchParams();
  const expertId            = searchParams.get('expertId');
  const navigate            = useNavigate();

  /* ─── 상태 ─── */
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ─── 데이터 로드 ─── */
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLectureDetail({ lectureRoomId, expertId });
      const d   = res.data;
      setInitial({
        thumbnail   : d.coverImageUrl,
        title       : d.title,
        description : d.description,
        fileUrl     : d.fileUrl,
        isPaid      : d.isPaid,
        tags        : d.tags ?? [],
      });
    } catch (err) {
      console.error(err);
      alert('강의 정보를 불러오지 못했습니다.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [lectureRoomId, expertId, navigate]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  /* ─── 저장 ─── */
  const handleSave = async (payload) => {
    try {
      await updateLecture({ lectureRoomId, expertId, ...payload });
      alert('저장되었습니다.');
      navigate(`/library/expert/${lectureRoomId}?expertId=${expertId}`);
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!initial)  return null;   // fetchDetail 에서 navigate(-1) 처리됨

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">강의실 수정</h1>

      <LectureForm
        initial={initial}
        onSave={handleSave}
        onCancel={() =>
          navigate(`/library/expert/${lectureRoomId}?expertId=${expertId}`)
        }
      />
    </div>
  );
};

export default LectureEdit;
