// lectory-client/src/components/library/LectureCard.jsx
import React from 'react';

/**
 * 강의실 카드 – 라이브러리 목록/grid 전용
 *
 * props
 *  • thumbnail        : String (nullable)
 *  • title            : String
 *  • expertName       : String
 *  • enrollmentCount  : Number
 *  • isPaid           : Boolean
 *  • onClick()        : 클릭 핸들러 (필수)
 */
const LectureCard = ({
  thumbnail,
  title,
  expertName,
  enrollmentCount = 0,
  isPaid = false,
  onClick,
}) => {
  return (
    <div
      className="cursor-pointer border rounded-lg overflow-hidden shadow hover:shadow-md transition"
      onClick={onClick}
    >
      {/* ── 썸네일 ── */}
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          No Image
        </div>
      )}

      {/* ── 내용 ── */}
      <div className="p-4 space-y-1">
        <h3 className="text-base font-semibold line-clamp-2">{title}</h3>

        <p className="text-sm text-gray-600">강사: {expertName}</p>
        <p className="text-sm text-gray-600">수강생: {enrollmentCount}</p>

        {isPaid && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded">
            유료
          </span>
        )}
      </div>
    </div>
  );
};

export default LectureCard;
