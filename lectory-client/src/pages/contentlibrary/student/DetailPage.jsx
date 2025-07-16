import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getLectureDetail, enroll } from '../../api/studentApi';
import LectureCard from '../../components/contentlibrary/common/LectureCard';
import ChapterList from '../../components/contentlibrary/common/ChapterList';
import CommentSection from '../../components/contentlibrary/common/CommentSection';
import EnrollButton from '../../components/contentlibrary/student/EnrollButton';
import Pagination from '../../components/contentlibrary/common/Pagination';

const DetailPage = () => {
  const { lectureRoomId } = useParams();
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('memberId');

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await getLectureDetail({ lectureRoomId, memberId });
        setDetail(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [lectureRoomId, memberId]);

  const handleEnroll = async () => {
    try {
      await enroll({ lectureRoomId, memberId });
      // refetch detail to show chapters/comments
      const res = await getLectureDetail({ lectureRoomId, memberId });
      setDetail(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!detail) return <div>강의를 찾을 수 없습니다.</div>;

  return (
    <div className="detail-page container mx-auto p-4">
      <LectureCard
        title={detail.title}
        thumbnail={detail.coverImageUrl}
        description={detail.description}
        expertName={detail.expertName}
        enrollmentCount={detail.enrollmentCount}
        isPaid={detail.isPaid}
      />

      {/* 수강 전 */}
      {!detail.isEnrolled && (
        <EnrollButton onEnroll={handleEnroll} />
      )}

      {/* 수강 후 */}
      {detail.isEnrolled && (
        <>
          <h2 className="mt-8 text-2xl font-semibold">강의 목록</h2>
          <ChapterList chapters={detail.chapters} />

          <h2 className="mt-8 text-2xl font-semibold">수강평</h2>
          <CommentSection comments={detail.lectureComments} />
        </>
      )}
    </div>
  );
};

export default DetailPage;
