// lectory-client/src/components/detail/ChapterList.jsx
import React from 'react';

/**
 * 강의실 상세 페이지 – 챕터 목록
 *
 * props
 *  • chapters : Array<ChapterDto>
 *      └─ {
 *            chapterId   : Long      (nullable ― key 대용)
 *            chapterName : String
 *            expectedTime: String
 *            orderNum    : Number
 *            videoUrl    : String    (optional)
 *         }
 *  • onSelect(chapter) : 챕터 클릭 콜백 (선택)
 */
const ChapterList = ({ chapters = [], onSelect }) => {
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

            {/* videoUrl 프리뷰 (있을 때만) */}
            {c.videoUrl && (
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
