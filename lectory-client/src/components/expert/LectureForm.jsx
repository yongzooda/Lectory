// lectory-client/src/components/expert/LectureForm.jsx
import React, { useEffect, useState } from 'react';

/**
 * 전문가용 강의실( LectureRoom ) 생성·수정 폼
 *
 * props
 *  • initial     : {
 *        thumbnail, title, description,
 *        fileUrl, isPaid, tags:Array<string>
 *    }           (nullable → 신규)
 *  • onSave(data): Promise<void>    저장 콜백
 *  • onCancel()  : () => void       취소 (선택)
 */
const LectureForm = ({ initial = {}, onSave, onCancel }) => {
  /* ─── 상태 ─── */
  const [thumbnail,   setThumbnail]   = useState('');
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl,     setFileUrl]     = useState('');
  const [isPaid,      setIsPaid]      = useState(false);
  const [tagsInput,   setTagsInput]   = useState('');
  const [saving,      setSaving]      = useState(false);

  /* ─── 초기값 (수정 모드) ─── */
  useEffect(() => {
    if (initial) {
      setThumbnail(initial.thumbnail   ?? '');
      setTitle(initial.title           ?? '');
      setDescription(initial.description ?? '');
      setFileUrl(initial.fileUrl       ?? '');
      setIsPaid(initial.isPaid         ?? false);
      setTagsInput((initial.tags ?? []).join(', '));
    }
  }, [initial]);

  /* ─── 제출 ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSave) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      thumbnail : thumbnail.trim(),
      title     : title.trim(),
      description: description.trim(),
      fileUrl   : fileUrl.trim(),
      isPaid,
      tags,
    };

    try {
      setSaving(true);
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  /* ─── UI ─── */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 썸네일 URL */}
      <div>
        <label className="block mb-1 font-semibold">썸네일 URL</label>
        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="https://…"
        />
      </div>

      {/* 제목 */}
      <div>
        <label className="block mb-1 font-semibold">강의실 제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* 소개 */}
      <div>
        <label className="block mb-1 font-semibold">소개글</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border rounded p-2 resize-none"
        />
      </div>

      {/* 첨부 파일 URL */}
      <div>
        <label className="block mb-1 font-semibold">첨부파일 URL</label>
        <input
          type="text"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="https://…"
        />
      </div>

      {/* 유료 여부 */}
      <div className="flex items-center space-x-2">
        <input
          id="isPaid"
          type="checkbox"
          checked={isPaid}
          onChange={(e) => setIsPaid(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="isPaid" className="font-medium">
          유료 강의실
        </label>
      </div>

      {/* 태그 */}
      <div>
        <label className="block mb-1 font-semibold">
          태그 (쉼표로 구분)
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* 버튼 */}
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

export default LectureForm;
