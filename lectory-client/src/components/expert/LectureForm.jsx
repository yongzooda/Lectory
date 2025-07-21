// src/components/expert/LectureForm.jsx
import styles from '../../assets/css/contentLibrary.module.css';

import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';

/**
 * props:
 *  • initial: {
 *        coverImageUrl, title, description,
 *        fileUrl, isPaid, tags: string[]
 *    }
 *  • onSave(payload): Promise<void>
 *  • onCancel(): void
 */
export default function LectureForm({ initial = {}, onSave, onCancel }) {
  const [coverMode, setCoverMode]     = useState('file');  // 'url' | 'file'
  const [coverUrlInput, setCoverUrl]  = useState('');
  const [coverFile, setCoverFile]     = useState(null);

  const [zipMode, setZipMode]         = useState('file');
  const [zipUrlInput, setZipUrl]      = useState('');
  const [zipFile, setZipFile]         = useState(null);

  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid]           = useState(false);
  const [tagsInput, setTagsInput]     = useState('');

  const [saving, setSaving]           = useState(false);

  // 초기값 동기화
  useEffect(() => {
    setTitle(initial.title || '');
    setDescription(initial.description || '');
    setIsPaid(initial.isPaid || false);
    setTagsInput((initial.tags || []).join(', '));

    if (initial.coverImageUrl) {
      setCoverMode('url');
      setCoverUrl(initial.coverImageUrl);
    } else {
      setCoverMode('file');
      setCoverUrl('');
    }

    if (initial.fileUrl) {
      setZipMode('url');
      setZipUrl(initial.fileUrl);
    } else {
      setZipMode('file');
      setZipUrl('');
    }
    // 파일 모드는 항상 빈 상태로 시작
    setCoverFile(null);
    setZipFile(null);
  }, [initial]);

  // 서버에 파일 업로드
  const upload = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('/files/upload', fd);
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 공통 payload
      const payload = {
        title: title.trim(),
        description: description.trim(),
        isPaid,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      // coverImageUrl
      if (coverMode === 'file' && coverFile) {
        payload.coverImageUrl = await upload(coverFile);
      } else if (coverMode === 'url' && coverUrlInput.trim()) {
        payload.coverImageUrl = coverUrlInput.trim();
      }

      // fileUrl
      if (zipMode === 'file' && zipFile) {
        payload.fileUrl = await upload(zipFile);
      } else if (zipMode === 'url' && zipUrlInput.trim()) {
        payload.fileUrl = zipUrlInput.trim();
      }

      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const fileCls =
    'block w-full text-sm text-gray-700 ' +
    'file:mr-4 file:py-2 file:px-4 ' +
    'file:rounded file:border-0 ' +
    'file:text-sm file:bg-blue-50 file:text-blue-700 ' +
    'hover:file:bg-blue-100';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 커버 이미지 */}
      <div>
        <label className="block font-semibold mb-1">커버 이미지</label>
        <div className="flex items-center space-x-4 mb-2">
          {['url', 'file'].map((m) => (
            <label key={m} className="inline-flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                value={m}
                checked={coverMode === m}
                onChange={() => {
                  setCoverMode(m);
                  if (m === 'url') setCoverFile(null);
                  else setCoverUrl('');
                }}
              />
              <span>{m === 'url' ? 'URL 입력' : '파일 업로드'}</span>
            </label>
          ))}
        </div>
        {coverMode === 'url' ? (
          <input
            type="text"
            value={coverUrlInput}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://…"
            className="w-full border rounded p-2"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className={fileCls}
          />
        )}
      </div>

      {/* 강의실 제목 */}
      <div>
        <label className="block font-semibold mb-1">강의실 제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>

      {/* 소개글 */}
      <div>
        <label className="block font-semibold mb-1">소개글</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border rounded p-2 resize-none"
        />
      </div>

      {/* 자료 ZIP */}
      <div>
        <label className="block font-semibold mb-1">자료 ZIP</label>
        <div className="flex items-center space-x-4 mb-2">
          {['url', 'file'].map((m) => (
            <label key={m} className="inline-flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                value={m}
                checked={zipMode === m}
                onChange={() => {
                  setZipMode(m);
                  if (m === 'url') setZipFile(null);
                  else setZipUrl('');
                }}
              />
              <span>{m === 'url' ? 'URL 입력' : '파일 업로드'}</span>
            </label>
          ))}
        </div>
        {zipMode === 'url' ? (
          <input
            type="text"
            value={zipUrlInput}
            onChange={(e) => setZipUrl(e.target.value)}
            placeholder="https://…"
            className="w-full border rounded p-2"
          />
        ) : (
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setZipFile(e.target.files[0])}
            className={fileCls}
          />
        )}
      </div>

      {/* 유료 여부 */}
      <div className="flex items-center space-x-2">
        <input
          id="isPaid"
          type="checkbox"
          checked={isPaid}
          onChange={(e) => setIsPaid(e.target.checked)}
        />
        <label htmlFor="isPaid" className="font-medium">유료 강의실</label>
      </div>

      {/* 태그 */}
      <div>
        <label className="block font-semibold mb-1">태그 (쉼표로 구분)</label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="예: Java, Spring"
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
}
