// src/pages/contentlibrary/expert/ManageChapters.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getLectureDetail,
  createChapter,
  updateChapter,
  deleteChapter,
} from '../../../api/expertApi';

import ChapterForm   from '../../../components/expert/ChapterForm';
import DeleteConfirm from '../../../components/expert/DeleteConfirm';

/**
 * 전문가용 – 챕터 관리 페이지
 * URL: /library/expert/:lectureRoomId/chapters
 *
 * 기능
 *  • 현재 강의실의 모든 챕터를 한눈에 확인
 *  • 챕터 추가 / 수정 / 삭제
 */
const ManageChaptersPage = () => {
  const { lectureRoomId } = useParams();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading]   = useState(true);

  const [editingId,       setEditingId]      = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId,  setDeleteTargetId]  = useState(null);

  const fetchChapters = useCallback(async () => {
    setLoading(true);
    try {
      // 백엔드가 JWT에서 expertId를 꺼내므로 파라미터 없이 호출
      const res = await getLectureDetail({ lectureRoomId });
      setChapters(res.data.chapters ?? []);
    } catch (err) {
      console.error(err);
      alert('챕터 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [lectureRoomId]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const handleCreate = async (payload) => {
    await createChapter({ lectureRoomId, ...payload });
    await fetchChapters();
  };

  const handleUpdate = async (chapterId, payload) => {
    await updateChapter({ chapterId, ...payload });
    setEditingId(null);
    await fetchChapters();
  };

  const handleDelete = async () => {
    await deleteChapter({ chapterId: deleteTargetId });
    setShowDeleteModal(false);
    setDeleteTargetId(null);
    await fetchChapters();
  };

  return (
    <div className="container mx-auto p-8 space-y-10">
      <h1 className="text-2xl font-bold">챕터 관리</h1>

      {loading ? (
        <div className="text-center py-20">Loading…</div>
      ) : chapters.length === 0 ? (
        <p className="text-center text-gray-500">등록된 챕터가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {chapters.map(c =>
            editingId === c.chapterId ? (
              <li key={c.chapterId} className="border rounded p-4">
                <ChapterForm
                  initial={{
                    chapterName: c.chapterName,
                    expectedTime: c.expectedTime,
                    orderNum: c.orderNum,
                    videoUrl: c.videoUrl,
                  }}
                  onSave={data => handleUpdate(c.chapterId, data)}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <li
                key={c.chapterId}
                className="border rounded p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{c.chapterName}</h3>
                  <p className="text-sm text-gray-600">
                    예상 시간: {c.expectedTime} · 순서: {c.orderNum}
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
                    onClick={() => {
                      setDeleteTargetId(c.chapterId);
                      setShowDeleteModal(true);
                    }}
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

      <section className="border-t pt-6">
        <h2 className="text-lg font-bold mb-2">새 챕터 추가</h2>
        <ChapterForm onSave={handleCreate} />
      </section>

      <DeleteConfirm
        open={showDeleteModal}
        message="해당 챕터를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ManageChaptersPage;
