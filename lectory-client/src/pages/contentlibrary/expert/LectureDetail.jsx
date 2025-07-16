// lectory-client/src/pages/contentlibrary/expert/LectureDetail.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  getLectureDetail,          // expertApi
  updateLecture,
  deleteLecture,
  createChapter,
  updateChapter,
  deleteChapter,
} from '../../../api/expertApi';

import LectureHeader   from '../../../components/detail/LectureHeader';
import ChapterList     from '../../../components/detail/ChapterList';
import CommentSection  from '../../../components/detail/CommentSection';
import EnrollButton    from '../../../components/detail/EnrollButton';   // 전문가에게는 안 보이지만 재사용 가능
import LectureForm     from '../../../components/expert/LectureForm';
import ChapterForm     from '../../../components/expert/ChapterForm';
import DeleteConfirm   from '../../../components/expert/DeleteConfirm';

/* ────────────────────────────────────────────────────────── */

const ExpertLectureDetail = () => {
  const { lectureRoomId } = useParams();
  const [searchParams]    = useSearchParams();
  const expertId          = searchParams.get('expertId');   // URL 유지용
  const navigate          = useNavigate();

  /* ─── 상태 ─── */
  const [detail, setDetail]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [editMode, setEditMode]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  /* ─── 데이터 불러오기 ─── */
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLectureDetail({ lectureRoomId, expertId });
      setDetail(res.data);
    } catch (err) {
      console.error(err);
      alert('강의 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [lectureRoomId, expertId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  /* ─── 강의실 수정 저장 ─── */
  const handleSaveLecture = async (payload) => {
    try {
      await updateLecture({ lectureRoomId, expertId, ...payload });
      setEditMode(false);
      await fetchDetail();
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    }
  };

  /* ─── 강의실 삭제 ─── */
  const handleDelete = async () => {
    try {
      await deleteLecture({ lectureRoomId, expertId });
      alert('삭제되었습니다.');
      navigate(`/library/expert?expertId=${expertId}`);
    } catch (err) {
      console.error(err);
      alert('삭제 실패');
    }
  };

  /* ─── 챕터 CRUD ─── */
  const handleCreateChapter = async (data) => {
    await createChapter({ lectureRoomId, expertId, ...data });
    await fetchDetail();
  };
  const handleUpdateChapter = async (chapterId, data) => {
    await updateChapter({ chapterId, expertId, ...data });
    await fetchDetail();
  };
  const handleDeleteChapter = async (chapterId) => {
    await deleteChapter({ chapterId, expertId });
    await fetchDetail();
  };

  /* ─── 렌더 ─── */
  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!detail)  return <div className="p-8 text-center">강의실을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-6 space-y-10">
      {/* ── 강의실 헤더 or 수정 폼 ── */}
      {editMode ? (
        <LectureForm
          initial={{
            thumbnail   : detail.coverImageUrl,
            title       : detail.title,
            description : detail.description,
            fileUrl     : detail.fileUrl,
            isPaid      : detail.isPaid,
            tags        : detail.tags ?? [],
          }}
          onSave={handleSaveLecture}
          onCancel={() => setEditMode(false)}
        />
      ) : (
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
      )}

      {/* ── 액션 버튼 ── */}
      {!editMode && (
        <div className="flex space-x-3">
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            강의실 수정
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded"
          >
            강의실 삭제
          </button>
        </div>
      )}

      {/* ── 챕터 목록 & 추가 폼 ── */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold">챕터 목록</h2>
        <ChapterList
          chapters={detail.chapters}
          onSelect={(c) =>
            handleUpdateChapter(c.chapterId, {
              chapterName: c.chapterName,
              expectedTime: c.expectedTime,
              orderNum: c.orderNum,
              videoUrl: c.videoUrl,
            })
          }
        />
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">새 챕터 추가</h3>
          <ChapterForm onSave={handleCreateChapter} />
        </div>
      </section>

      {/* ── 댓글 ── */}
      <section>
        <h2 className="text-xl font-bold mb-2">수강평</h2>
        <CommentSection comments={detail.lectureComments} />
      </section>

      {/* ── 삭제 확인 모달 ── */}
      <DeleteConfirm
        open={showDelete}
        message="강의실을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
};

export default ExpertLectureDetail;
