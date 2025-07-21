import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate }            from 'react-router-dom';

import {
  getLectureDetail,
  updateLecture,
  createChapter,
  updateChapter,
  deleteChapter,
} from '../../../api/expertApi';

import LectureForm   from '../../../components/expert/LectureForm';
import ChapterForm   from '../../../components/expert/ChapterForm';
import DeleteConfirm from '../../../components/expert/DeleteConfirm';

export default function LectureEdit() {
  const { lectureRoomId } = useParams();
  const navigate          = useNavigate();

  // 1) 메타 & 챕터 리스트
  const [initialMeta, setInitialMeta] = useState(null);
  const [chapters,    setChapters]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  // 2) UI 상태
  const [savingMeta, setSavingMeta] = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [delId,       setDelId]       = useState(null);

  // 3) 데이터 로드
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLectureDetail(lectureRoomId);

      setInitialMeta({
        coverImageUrl: data.coverImageUrl,
        title        : data.title,
        description  : data.description,
        fileUrl      : data.fileUrl,
        isPaid       : data.isPaid,
        tags         : data.tags || [],
      });
      setChapters(data.chapters || []);
    } catch (err) {
      console.error(err);
      alert('강의 정보를 불러오지 못했습니다.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [lectureRoomId, navigate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 4) 메타 저장
  const handleSaveMeta = async (payload) => {
    setSavingMeta(true);
    try {
      await updateLecture({ lectureRoomId, ...payload });
      await fetchAll();
      alert('강의실 정보가 저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSavingMeta(false);
    }
  };

  // 5) 챕터 CRUD
  const handleCreateChap = async (payload) => {
    await createChapter({ lectureRoomId, ...payload });
    await fetchAll();
  };

  const handleUpdateChap = async (chapterId, payload) => {
    await updateChapter({ chapterId, ...payload });
    setEditingId(null);
    await fetchAll();
  };

  const handleDeleteChap = async () => {
    await deleteChapter(delId);
    setDelId(null);
    await fetchAll();
  };

  // 로딩 처리
  if (loading || !initialMeta) {
    return <div className="p-8 text-center">Loading…</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">강의실 수정</h1>

      {/* 1) 강의실 메타폼 */}
      <LectureForm
        initial={initialMeta}
        onSave={handleSaveMeta}
        onCancel={() => navigate(`/library/expert/${lectureRoomId}`)}
      />

      {/* 2) 챕터 관리 */}
      <section className="space-y-6 pt-10 border-t">
        <h2 className="text-xl font-bold">챕터 관리</h2>

        {chapters.length === 0 ? (
          <p className="text-gray-500">등록된 챕터가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {chapters.map(c =>
              editingId === c.chapterId ? (
                <li key={c.chapterId} className="border rounded p-4">
                  <ChapterForm
                    // videoUrl 이 변경될 때마다 완전 새로 마운트되도록 key 에 포함
                    key={`${c.chapterId}-${c.videoUrl}`}
                    initial={{
                      chapterName : c.chapterName,
                      expectedTime: c.expectedTime,
                      orderNum    : c.orderNum,
                      videoUrl    : c.videoUrl,
                      tags        : c.tags,
                    }}
                    onSave={d => handleUpdateChap(c.chapterId, d)}
                    onCancel={() => setEditingId(null)}
                  />
                </li>
              ) : (
                <li
                  key={c.chapterId}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      {c.orderNum}. {c.chapterName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      예상 {c.expectedTime || '-'}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingId(c.chapterId)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setDelId(c.chapterId)}
                      className="px-3 py-1 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}

        {/* 새 챕터 추가 */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-2">새 챕터 추가</h3>
          <ChapterForm onSave={handleCreateChap} />
        </div>
      </section>

      {/* 삭제 확인 */}
      <DeleteConfirm
        open={delId != null}
        message="해당 챕터를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDeleteChap}
        onCancel={() => setDelId(null)}
      />
    </div>
  );
}
