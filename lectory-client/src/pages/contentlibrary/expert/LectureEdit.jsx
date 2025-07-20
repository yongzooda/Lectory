import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const [initialMeta, setInitialMeta] = useState(null);
  const [chapters,    setChapters]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [savingMeta,  setSavingMeta]  = useState(false);
  const [delId,       setDelId]       = useState(null);
  const [editingId,   setEditingId]   = useState(null);

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
    } catch {
      alert('강의 정보를 불러오지 못했습니다.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [lectureRoomId, navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSaveMeta = async (payload) => {
    setSavingMeta(true);
    try {
      await updateLecture({ lectureRoomId, ...payload });
      await fetchAll();                   // 신규 URL 반영
      alert('강의실 정보가 저장되었습니다.');
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSavingMeta(false);
    }
  };

  if (loading || !initialMeta) {
    return <div className="p-8 text-center">Loading…</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold">강의실 수정</h1>

      <LectureForm
        initial={initialMeta}
        onSave={handleSaveMeta}
        onCancel={() => navigate(`/library/expert/${lectureRoomId}`)}
      />

      {/* 이하 챕터 관리 (기존 코드 재사용) */}
      <section className="space-y-6 pt-10 border-t">
        <h2 className="text-xl font-bold">챕터 관리</h2>
        {/* … ChapterForm, DeleteConfirm 등 … */}
      </section>
    </div>
  );
}
