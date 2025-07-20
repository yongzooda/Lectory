// src/components/expert/ChapterForm.jsx

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import api from '../../api/axiosInstance';
import { fetchAllTags } from '../../api/expertApi';

/**
 * 전문가용 챕터(강의) 등록·수정 폼
 *
 * props:
 *  • initial : {
 *      chapterName, expectedTime, orderNum,
 *      videoUrl, tags: string[]
 *    } (nullable → 신규)
 *  • onSave(payload): Promise<void>
 *  • onCancel(): void (선택)
 */
export default function ChapterForm({ initial = {}, onSave, onCancel }) {
  // ───────── 폼 상태 ─────────
  const [chapterName, setChapterName]   = useState('');
  const [expectedTime, setExpectedTime] = useState('');
  const [orderNum, setOrderNum]         = useState(1);

  const [videoMode, setVideoMode] = useState('file'); // 'url' | 'file'
  const [videoUrl, setVideoUrl]   = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const [tags, setTags]       = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [saving, setSaving] = useState(false);

  // ───────── initial prop 동기화 ─────────
  useEffect(() => {
    setChapterName(initial.chapterName ?? '');
    setExpectedTime(initial.expectedTime ?? '');
    setOrderNum(initial.orderNum ?? 1);

    if (initial.videoUrl) {
      setVideoMode('url');
      setVideoUrl(initial.videoUrl);
    } else {
      setVideoMode('file');
      setVideoUrl('');
    }
    setVideoFile(null);

    setTags((initial.tags ?? []).map(t => ({ label: t, value: t })));
  }, [
    initial.chapterName,
    initial.expectedTime,
    initial.orderNum,
    initial.videoUrl,
    JSON.stringify(initial.tags),
  ]);

  // ───────── 태그 풀 1회 로딩 ─────────
  useEffect(() => {
    fetchAllTags()
      .then(({ data }) => {
        setAllTags(data.map(t => ({ label: t, value: t })));
      })
      .catch(console.error);
  }, []);

  // ───────── 파일 업로드 헬퍼 ─────────
  const uploadFile = async file => {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('/files/upload', fd);
    return data.url;  // "/files/{id}"
  };

  // ───────── 폼 제출 ─────────
  const handleSubmit = async e => {
    e.preventDefault();
    if (!onSave) return;

    setSaving(true);
    try {
      const finalVideoUrl =
        videoMode === 'file' && videoFile
          ? await uploadFile(videoFile)
          : videoUrl.trim();

      await onSave({
        chapterName : chapterName.trim(),
        expectedTime: expectedTime.trim(),
        orderNum    : Number(orderNum),
        videoUrl    : finalVideoUrl,
        tags        : tags.map(t => t.value),
      });
    } finally {
      setSaving(false);
    }
  };

  const fileInputCls =
    'block w-full text-sm text-gray-700 ' +
    'file:mr-4 file:py-2 file:px-4 ' +
    'file:rounded file:border-0 ' +
    'file:text-sm file:bg-blue-50 file:text-blue-700 ' +
    'hover:file:bg-blue-100';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 챕터명 */}
      <div>
        <label className="block mb-1 font-semibold">챕터명 *</label>
        <input
          type="text"
          value={chapterName}
          onChange={e => setChapterName(e.target.value)}
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
          onChange={e => setExpectedTime(e.target.value)}
          placeholder="예: 15분, 01:30:00"
          className="w-full border rounded p-2"
        />
      </div>

      {/* 표시 순서 */}
      <div>
        <label className="block mb-1 font-semibold">표시 순서</label>
        <input
          type="number"
          value={orderNum}
          onChange={e => setOrderNum(e.target.value)}
          min={1}
          step={1}
          className="border rounded p-2 w-32"
          required
        />
      </div>

      {/* 동영상 입력 방식 */}
      <div>
        <label className="block mb-1 font-semibold">동영상</label>
        <div className="flex items-center space-x-6 mb-3">
          {['url', 'file'].map(m => (
            <label key={m} className="inline-flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="videoMode"
                value={m}
                checked={videoMode === m}
                onChange={() => {
                  setVideoMode(m);
                  if (m === 'url') {
                    setVideoFile(null);
                  } else {
                    setVideoUrl('');
                  }
                }}
              />
              <span>{m === 'url' ? 'URL 입력' : '파일 업로드'}</span>
            </label>
          ))}
        </div>

        {videoMode === 'url' ? (
          <input
            type="text"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://… 또는 /videos/intro.mp4"
            className="w-full border rounded p-2"
            required
          />
        ) : (
          <>
            <input
              type="file"
              accept="video/*"
              onChange={e => setVideoFile(e.target.files?.[0] ?? null)}
              className={fileInputCls}
              required
            />
            {videoFile && (
              <p className="mt-1 text-sm text-gray-600">
                선택된 파일:&nbsp;
                <span className="font-medium">{videoFile.name}</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* 태그 멀티셀렉트 */}
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

      {/* 액션 버튼 */}
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
