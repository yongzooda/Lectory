// lectory-client/src/components/expert/ChapterForm.jsx
import React, { useState, useEffect } from 'react';

/**
 * 전문가용 챕터(강의) 등록·수정 폼
 *
 * props
 *  • initial     : { chapterName, expectedTime, orderNum, videoUrl }  (nullable → 신규)
 *  • onSave(data): Promise<void>   저장 버튼 클릭 시 호출
 *  • onCancel()  : () => void      취소 버튼 클릭 (선택)
 */
const ChapterForm = ({ initial = {}, onSave, onCancel }) => {
  const [chapterName, setChapterName] = useState('');
  const [expectedTime, setExpectedTime] = useState('');
  const [orderNum, setOrderNum] = useState(1);
  const [videoUrl, setVideoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  /* 👉 초기값 세팅 (수정 모드) */
  useEffect(() => {
    if (initial) {
      setChapterName(initial.chapterName ?? '');
      setExpectedTime(initial.expectedTime ?? '');
      setOrderNum(initial.orderNum ?? 1);
      setVideoUrl(initial.videoUrl ?? '');
    }
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSave) return;

    const payload = {
      chapterName: chapterName.trim(),
      expectedTime: expectedTime.trim(),
      orderNum: Number(orderNum),
      videoUrl: videoUrl.trim(),
    };

    try {
      setSaving(true);
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ─── 이름 ─── */}
      <div>
        <label className="block mb-1 font-semibold">챕터명</label>
        <input
          type="text"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* ─── 예상 시간 ─── */}
      <div>
        <label className="block mb-1 font-semibold">예상 소요시간</label>
        <input
          type="text"
          value={expectedTime}
          onChange={(e) => setExpectedTime(e.target.value)}
          placeholder="예: 15분, 01:30:00"
          className="w-full border rounded p-2"
        />
      </div>

      {/* ─── 순서 ─── */}
      <div>
        <label className="block mb-1 font-semibold">표시 순서</label>
        <input
          type="number"
          min={1}
          value={orderNum}
          onChange={(e) => setOrderNum(e.target.value)}
          className="w-32 border rounded p-2"
          required
        />
      </div>

      {/* ─── 동영상 URL ─── */}
      <div>
        <label className="block mb-1 font-semibold">동영상 URL</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* ─── 버튼 ─── */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {saving ? '저장 중…' : '저장'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default ChapterForm;
