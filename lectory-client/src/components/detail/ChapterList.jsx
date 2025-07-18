// src/components/detail/ChapterList.jsx
import React from 'react';

/**
 * 강의실 상세 페이지 – 챕터 목록
 *
 * props
 *  • chapters    : Array<{
 *        chapterId: number,
 *        chapterName: string,
 *        expectedTime: string,
 *        orderNum: number,
 *        videoUrl?: string | null,
 *        tags: string[]
 *    }>
 *  • isEnrolled  : boolean                  — 수강 여부 (true면 videoUrl 노출)
 *  • onSelect    : (chapter) => void (선택)  — 챕터 클릭 콜백
 */
const ChapterList = ({ chapters = [], isEnrolled = false, onSelect }) => {
  if (chapters.length === 0) {
    return (
      <p className="text-center text-gray-500">
        등록된 챕터가 없습니다.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {chapters
        .slice()
        .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
        .map((c, i) => (
          <li
            key={c.chapterId ?? i}
            className="p-4 border rounded-lg hover:shadow transition cursor-pointer"
            onClick={() => onSelect?.(c)}
          >
            {/* 챕터 헤더 */}
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold">
                {c.orderNum != null ? `${c.orderNum}. ` : ''}
                {c.chapterName}
              </h3>
              {c.expectedTime && (
                <span className="text-sm text-gray-500">
                  {c.expectedTime}
                </span>
              )}
            </div>

            {/* 태그 배지 */}
            <div className="flex flex-wrap gap-2 mb-2">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 비디오 플레이어: 수강 중일 때만 노출 */}
            {isEnrolled && c.videoUrl && (
              <video
                src={c.videoUrl}
                className="w-full rounded shadow-inner mt-2"
                controls
                preload="metadata"
              />
            )}
          </li>
        ))}
    </ul>
  );
};

export default ChapterList;
