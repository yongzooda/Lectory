import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getLectureDetail,
  updateLecture,
  deleteLecture,
  createChapter,
  updateChapter,
  deleteChapter,
} from '../../../api/expertApi';

import LectureHeader   from '../../../components/detail/LectureHeader';
import ChapterList     from '../../../components/detail/ChapterList';
import CommentSection  from '../../../components/detail/CommentSection';
import LectureForm     from '../../../components/expert/LectureForm';
import ChapterForm     from '../../../components/expert/ChapterForm';
import DeleteConfirm   from '../../../components/expert/DeleteConfirm';

const ExpertLectureDetail = () => {
  const { lectureRoomId } = useParams();
  const navigate          = useNavigate();

  const [detail,    setDetail]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [editMode,  setEditMode]  = useState(false);
  const [showDel,   setShowDel]   = useState(false);

  /* ------------------------------------------------------------------
   * 데이터 로딩
   * ----------------------------------------------------------------*/
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLectureDetail(lectureRoomId);
      setDetail(res.data);
    } catch {
      alert('강의 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [lectureRoomId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  /* ------------------------------------------------------------------
   * 강의실 CRUD 핸들러
   * ----------------------------------------------------------------*/
  const handleSaveLecture = async (payload) => {
    try {
      // ⬇️ 객체 파라미터 형태에 맞춰 수정
      await updateLecture({ lectureRoomId, ...payload });
      setEditMode(false);
      await fetchDetail();
    } catch {
      alert('저장 실패');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLecture(lectureRoomId);
      alert('삭제되었습니다.');
      navigate('/library/expert');
    } catch {
      alert('삭제 실패');
    }
  };

  /* ------------------------------------------------------------------
   * 챕터 CRUD 핸들러
   * ----------------------------------------------------------------*/
  const handleCreateChapter = async (data) => {
    await createChapter({ lectureRoomId, ...data });
    await fetchDetail();
  };

  const handleUpdateChapter = async (chapterId, data) => {
    // ⬇️ 객체 파라미터 형태에 맞춰 수정
    await updateChapter({ chapterId, ...data });
    await fetchDetail();
  };

  const handleDeleteChapter = async (chapterId) => {
    await deleteChapter(chapterId);
    await fetchDetail();
  };

  /* ------------------------------------------------------------------
   * 렌더링 분기
   * ----------------------------------------------------------------*/
  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!detail)  return <div className="p-8 text-center">강의실을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto p-6 space-y-10">
      {editMode ? (
        <LectureForm
          initial={{
            thumbnail:   detail.coverImageUrl,
            title:       detail.title,
            description: detail.description,
            fileUrl:     detail.fileUrl,
            isPaid:      detail.isPaid,
            tags:        detail.tags || [],
          }}
          onSave={handleSaveLecture}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <>
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
          <div className="inline-block bg-green-500 text-white px-3 py-1 rounded">
            수강 중
          </div>
          {detail.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 my-4">
              {detail.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {!editMode && (
        <div className="flex space-x-3">
          <button onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded">
            강의실 수정
          </button>
          <button onClick={() => setShowDel(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded">
            강의실 삭제
          </button>
        </div>
      )}

      {!editMode && (
        <>
          {detail.fileUrl && (
            <section className="mt-6">
              <h2 className="text-xl font-bold mb-2">강의 자료</h2>
              <a href={detail.fileUrl} target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:underline">
                전체 강의 자료 다운로드
              </a>
            </section>
          )}

          <section className="space-y-6 mt-6">
            <h2 className="text-xl font-bold">챕터 목록</h2>
            <ChapterList
              chapters={detail.chapters}
              isEnrolled={true}
              onSelect={c => handleUpdateChapter(c.chapterId, {
                chapterName:   c.chapterName,
                expectedTime:  c.expectedTime,
                orderNum:      c.orderNum,
                videoUrl:      c.videoUrl,
              })}
            />
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">새 챕터 추가</h3>
              <ChapterForm onSave={handleCreateChapter} />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">수강평</h2>
            <CommentSection comments={detail.lectureComments} />
          </section>
        </>
      )}

      <DeleteConfirm
        open={showDel}
        message="강의실을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
        onCancel={() => setShowDel(false)}
      />
    </div>
  );
};

export default ExpertLectureDetail;
