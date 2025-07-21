// src/components/library/LectureCard.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * 강의실 카드 – 라이브러리 목록/grid 전용
 *
 * props
 *  • coverImageUrl    : string (nullable)     ― 커버 이미지 URL
 *  • title            : string                ― 강의실 제목
 *  • expertName       : string                ― 전문가 이름
 *  • enrollmentCount  : number                ― 수강생 수
 *  • isPaid           : boolean               ― 유료 여부
 *  • isEnrolled       : boolean               ― 수강중 여부
 *  • tags             : string[]              ― 태그 리스트
 *  • onClick          : () => void            ― 클릭 핸들러 (필수)
 */
const LectureCard = ({
  coverImageUrl,
  title,
  expertName,
  enrollmentCount = 0,
  isPaid = false,
  isEnrolled = false,
  tags = [],
  onClick,
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    className="cursor-pointer rounded-xl overflow-hidden bg-white shadow
               hover:shadow-lg hover:-translate-y-1 transition-transform duration-150"
  >
    {/* 커버 이미지 */}
    {coverImageUrl ? (
      <img
        src={`/api${coverImageUrl}`}
        alt={title}
        loading="lazy"
        className="w-full aspect-video object-cover"
      />
    ) : (
      <div className="w-full aspect-video flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        No Image
      </div>
    )}

    {/* 내용 */}
    <div className="p-4 space-y-1">
      <h3 className="text-base font-semibold line-clamp-2">{title}</h3>

      {/* 태그 뱃지 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded max-w-[96px] truncate"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-600">강사: {expertName}</p>
      <p className="text-sm text-gray-600">수강생: {enrollmentCount}</p>

      {/* 유료 뱃지 */}
      {isPaid && (
        <span className="inline-block mt-1 px-2 py-0.5 bg-rose-500/10 text-rose-600 text-xs rounded">
          유료
        </span>
      )}

      {/* 수강중 뱃지 */}
      {isEnrolled && (
        <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded">
          수강중
        </span>
      )}
    </div>
  </div>
);

LectureCard.propTypes = {
  coverImageUrl:    PropTypes.string,
  title:            PropTypes.string.isRequired,
  expertName:       PropTypes.string.isRequired,
  enrollmentCount:  PropTypes.number,
  isPaid:           PropTypes.bool,
  isEnrolled:       PropTypes.bool,
  tags:             PropTypes.arrayOf(PropTypes.string),
  onClick:          PropTypes.func.isRequired,
};

export default LectureCard;
