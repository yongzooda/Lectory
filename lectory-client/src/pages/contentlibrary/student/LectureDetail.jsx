// lectory-client/src/pages/contentlibrary/student/LectureDetail.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

import {
  getLectureDetail,
  enroll,
  postComment,
} from '../../../api/studentApi';

import LectureHeader  from '../../../components/detail/LectureHeader';
import EnrollButton   from '../../../components/detail/EnrollButton';
import ChapterList    from '../../../components/detail/ChapterList';
import CommentSection from '../../../components/detail/CommentSection';

/**
 * 수강생용 – 강의실 상세 페이지
 * URL: /library/:lectureRoomId?memberId=#
 */
const StudentLectureDetail = () => {
  const { lectureRoomId }  = useParams();
  const [searchParams]     = useSearchParams();
  const memberId           = searchParams.get('memberId');
  const navigate           = useNavigate();

  /* ─── 상태 ─── */
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ─── 데이터 로딩 ─── */
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLectureDetail({ lectureRoomId, memberId });
      setDetail(res.data);
    } catch (err) {
      console.error(err);
      alert('강의 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [lectureRoomId, memberId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  /* ─── 수강신청 ─── */
  const handleEnroll = async () => {
    try {
      await enroll({ lectureRoomId, memberId });
      navigate(
        `/library/${lectureRoomId}/enroll-result?memberId=${memberId}`
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '수강신청 실패');
    }
  };

  /* ─── 댓글 작성 ─── */
  const handleAddComment = async (content) => {
    try {
      await postComment({ lectureRoomId, memberId, content });
      await fetchDetail();          // 댓글 목록 갱신
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '댓글 등록 실패');
    }
  };

  /* ─── 렌더 ─── */
  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!detail)  return <div className="p-8 text-center">강의실을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-6 space-y-10">
      {/* ── 헤더 ── */}
      <LectureHeader
        title={detail.title}
        coverImageUrl={detail.coverImageUrl}
        description={detail.description}
        expertName={detail.expertName}
        enrollmentCount={detail.enrollmentCount}
        isPaid={detail.isPaid}
        createdAt={detail.createdAt}
        updatedAt={detail.updatedAt}
      />

      {/* ── 수강신청 버튼 ── */}
      {!detail.isEnrolled && detail.canEnroll && (
        <EnrollButton
          onEnroll={handleEnroll}
          isPaid={detail.isPaid}
        />
      )}

      {/* ── 챕터 & 댓글 (수강 후) ── */}
      {detail.isEnrolled && (
        <>
          <section className="space-y-4">
            <h2 className="text-xl font-bold">강의 목록</h2>
            <ChapterList chapters={detail.chapters} />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">수강평</h2>
            <CommentSection
              comments={detail.lectureComments}
              onAdd={handleAddComment}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default StudentLectureDetail;
