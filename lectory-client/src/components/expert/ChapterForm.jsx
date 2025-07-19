// src/components/expert/ChapterForm.jsx
import React, { useEffect, useState } from "react";
import Select           from "react-select";
import { fetchAllTags } from "../../api/expertApi";

/**
 * 전문가용 챕터(강의) 등록·수정 폼
 *
 * props
 *  • initial : {
 *        chapterName, expectedTime, orderNum,
 *        videoUrl, tags: string[]
 *    }
 *  • onSave  : (payload) => Promise<void>
 *  • onCancel: () => void (선택)
 */
const ChapterForm = ({ initial = {}, onSave, onCancel }) => {
  /* ───────── state ───────── */
  const [chapterName, setChapterName] = useState(
    () => initial.chapterName ?? ""
  );
  const [expectedTime, setExpectedTime] = useState(
    () => initial.expectedTime ?? ""
  );
  const [orderNum, setOrderNum] = useState(() => initial.orderNum ?? 1);
  const [videoUrl, setVideoUrl] = useState(() => initial.videoUrl ?? "");
  const [tags, setTags] = useState(() =>
    (initial.tags ?? []).map((t) => ({ label: t, value: t }))
  );

  const [allTags, setAllTags] = useState([]);
  const [saving,  setSaving]  = useState(false);

  /* ───────── 태그 풀 로딩 (1회) ───────── */
  useEffect(() => {
    fetchAllTags().then(({ data }) =>
      setAllTags(data.map((t) => ({ label: t, value: t })))
    );
  }, []);

  /* ───────── 제출 ───────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSave) return;

    const payload = {
      chapterName : chapterName.trim(),
      expectedTime: expectedTime.trim(),
      orderNum    : Number(orderNum),
      videoUrl    : videoUrl.trim(),
      tags        : tags.map((t) => t.value),
    };

    try {
      setSaving(true);
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  /* ───────── UI ───────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 챕터명 */}
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

      {/* 예상 소요시간 */}
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

      {/* 표시 순서 */}
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

      {/* 동영상 URL */}
      <div>
        <label className="block mb-1 font-semibold">동영상 URL</label>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://… 또는 /videos/intro.mp4"
          className="w-full border rounded p-2"
        />
      </div>

      {/* 태그 멀티-셀렉트 */}
      <div>
        <label className="block mb-1 font-semibold">태그</label>
        <Select
          isMulti
          options={allTags}
          value={tags}
          onChange={setTags}
          placeholder="태그 입력 또는 선택…"
          className="react-select-container"
        />
      </div>

      {/* 버튼 */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {saving ? "저장 중…" : "저장"}
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
