import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  getLectureDetail as getExpertLectureDetail,
  deleteLecture as deleteExpertLecture
} from '../../api/expertApi';
import LectureCard from '../../components/contentlibrary/common/LectureCard';
import ChapterList from '../../components/contentlibrary/common/ChapterList';
import CommentSection from '../../components/contentlibrary/common/CommentSection';

const ExpertDetailPage = () => {
  const { lectureRoomId } = useParams();
  const [searchParams] = useSearchParams();
  const expertId = searchParams.get('expertId');
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await getExpertLectureDetail({ lectureRoomId, expertId });
        setDetail(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [lectureRoomId, expertId]);

  const handleEdit = () => {
    navigate(
      `/library/expert/${lectureRoomId}/edit?expertId=${expertId}`
    );
  };

  const handleDelete = async () => {
    try {
      await deleteExpertLecture({ lectureRoomId, expertId });
      navigate(`/library/expert?expertId=${expertId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleManageChapters = () => {
    navigate(
      `/library/expert/${lectureRoomId}/chapters?expertId=${expertId}`
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!detail) return <div>강의를 찾을 수 없습니다.</div>;

  return (
    <div className="expert-detail-page container mx-auto p-4">
      <LectureCard
        title={detail.title}
        thumbnail={detail.coverImageUrl}
        description={detail.description}
        expertName={detail.expertName}
        enrollmentCount={detail.enrollmentCount}
        isPaid={detail.isPaid}
      />

      <div className="action-buttons my-4 space-x-4">
        <button onClick={handleEdit} className="btn-primary">
          강의실 수정
        </button>
        <button onClick={handleDelete} className="btn-danger">
          강의실 삭제
        </button>
        <button onClick={handleManageChapters} className="btn-outline">
          챕터 관리
        </button>
      </div>

      <h2 className="mt-8 text-2xl font-semibold">챕터 목록</h2>
      <ChapterList chapters={detail.chapters} />

      <h2 className="mt-8 text-2xl font-semibold">수강평</h2>
      <CommentSection comments={detail.lectureComments} />
    </div>
  );
};

export default ExpertDetailPage;
