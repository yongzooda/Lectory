import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLectureDetail,
  updateLecture,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../../../api/expertApi";

import LectureForm   from "../../../components/expert/LectureForm";
import ChapterForm   from "../../../components/expert/ChapterForm";
import DeleteConfirm from "../../../components/expert/DeleteConfirm";

const LectureEdit = () => {
  const { lectureRoomId } = useParams();
  const navigate          = useNavigate();

  /* ───────── 강의실 메타데이터 state ───────── */
  const [initialMeta, setInitialMeta] = useState(null);
  const [savingMeta,  setSavingMeta]  = useState(false);

  /* ───────── 챕터 state ───────── */
  const [chapters,  setChapters] = useState([]);
  const [editingId, setEditingId] = useState(null); // 현재 수정 중 챕터 id
  const [delId,     setDelId]    = useState(null); // 삭제 대상 id

  const [loading, setLoading] = useState(true);

  /* ───────── 데이터 로드 ───────── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLectureDetail(lectureRoomId);
      setInitialMeta({
        thumbnail  : data.coverImageUrl,
        title      : data.title,
        description: data.description,
        fileUrl    : data.fileUrl,
        isPaid     : data.isPaid,
        tags       : data.tags ?? [],
      });
      setChapters(data.chapters ?? []);
    } catch (err) {
      console.error(err);
      alert("강의 정보를 불러오지 못했습니다.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [lectureRoomId, navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ───────── 강의실 메타 저장 ───────── */
  const handleSaveMeta = async (payload) => {
    try {
      setSavingMeta(true);
      await updateLecture({ lectureRoomId, ...payload });
      await fetchAll();
      alert("강의실 정보가 저장되었습니다.");
    } finally {
      setSavingMeta(false);
    }
  };

  /* ───────── 챕터 CRUD ───────── */
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

  /* ───────── 렌더 ───────── */
  if (loading || !initialMeta) {
    return <div className="p-8 text-center">Loading…</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">강의실 수정</h1>

      {/* 1) 강의실 메타데이터 편집 */}
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
            {chapters.map((c) =>
              editingId === c.chapterId ? (
                /* ── 수정 모드 ── */
                <li key={c.chapterId} className="border rounded p-4">
                  <ChapterForm
                    initial={{
                      chapterName : c.chapterName,
                      expectedTime: c.expectedTime,
                      orderNum    : c.orderNum,   // 중복 번호 그대로 전달
                      videoUrl    : c.videoUrl,
                      tags        : c.tags,
                    }}
                    onSave={(d) => handleUpdateChap(c.chapterId, d)}
                    onCancel={() => setEditingId(null)}
                  />
                </li>
              ) : (
                /* ── 읽기 모드 ── */
                <li
                  key={c.chapterId}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      {c.orderNum}. {c.chapterName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      예상 {c.expectedTime || "-"}
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
              ),
            )}
          </ul>
        )}

        {/* ── 새 챕터 추가 ── */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-2">새 챕터 추가</h3>
          <ChapterForm onSave={handleCreateChap} />
        </div>
      </section>

      {/* ── 삭제 확인 모달 ── */}
      <DeleteConfirm
        open={delId != null}
        message="해당 챕터를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDeleteChap}
        onCancel={() => setDelId(null)}
      />
    </div>
  );
};

export default LectureEdit;
