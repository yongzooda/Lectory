// src/pages/contentlibrary/student/LectureDetail.jsx
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

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleEnroll = async () => {
    try {
      await enroll({ lectureRoomId, memberId });
      navigate(`/library/${lectureRoomId}/enroll-result?memberId=${memberId}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '수강신청 실패');
    }
  };

  const handleAddComment = async (content) => {
    try {
      await postComment({ lectureRoomId, memberId, content });
      await fetchDetail();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '댓글 등록 실패');
    }
  };

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

      {/* ── 수강 중 배지 ── */}
      {detail.isEnrolled && (
        <div className="inline-block bg-green-500 text-white px-3 py-1 rounded">
          수강 중
        </div>
      )}

      {/* ── 강의 전체 태그 ── */}
      {detail.tags && detail.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {detail.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-200 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── 수강신청 버튼 ── */}
      {!detail.isEnrolled && detail.canEnroll && (
        <EnrollButton
          onEnroll={handleEnroll}
          isPaid={detail.isPaid}
        />
      )}

      {/* ── 수강 후 컨텐츠 ── */}
      {detail.isEnrolled && (
        <>
          {/* 강의 자료 다운로드 */}
          {detail.fileUrl && (
            <section className="mt-6">
              <h2 className="text-xl font-bold mb-2">강의 자료</h2>
              <a
                href={detail.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                전체 강의 자료 다운로드
              </a>
            </section>
          )}

          {/* 강의 목록 */}
          <section className="space-y-4 mt-6">
            <h2 className="text-xl font-bold">강의 목록</h2>
            <ChapterList
              chapters={detail.chapters}
              isEnrolled={detail.isEnrolled}
            />
          </section>

          {/* 수강평 */}
          <section className="space-y-4 mt-6">
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
