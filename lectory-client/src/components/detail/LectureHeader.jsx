// lectory-client/src/components/detail/LectureHeader.jsx
import React from 'react';

/**
 * 강의실 상세 페이지 – 상단 헤더
 *
 * props
 *  • title            : String
 *  • coverImageUrl    : String (nullable)
 *  • description      : String
 *  • expertName       : String
 *  • enrollmentCount  : Number
 *  • isPaid           : Boolean
 *  • chapters         : Array<{
 *        chapterId?: number,
 *        orderNum?: number,
 *        chapterName: string
 *    }>
 *  • createdAt        : String (ISO)   ─ 선택
 *  • updatedAt        : String (ISO)   ─ 선택
 */
const LectureHeader = ({
  title,
  coverImageUrl,
  description,
  expertName,
  enrollmentCount = 0,
  isPaid = false,
  chapters = [],
  createdAt,
  updatedAt,
}) => {
  return (
    <header className="space-y-6">
      {/* ── 커버 이미지 ── */}
      {coverImageUrl && (
        <img
          src={`/api${coverImageUrl}`}
          alt={title}
          className="w-full max-h-[320px] object-cover rounded-lg shadow"
        />
      )}

      {/* ── 제목 + 메타 ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center space-x-3">
          <span>{title}</span>
          {isPaid && (
            <span className="px-2 py-1 text-xs font-semibold bg-rose-600 text-white rounded">
              유료
            </span>
          )}
        </h1>

        <div className="mt-2 md:mt-0 text-sm text-gray-600 space-x-4">
          <span>강사: {expertName}</span>
          <span>수강생: {enrollmentCount}</span>
        </div>
      </div>

      {/* ── 소개 ── */}
      {description && (
        <p className="whitespace-pre-line leading-relaxed text-gray-800">
          {description}
        </p>
      )}

      {/* ── 목차 제목만 미리보기 ── */}
      {chapters.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold mb-2">강의 목차</h2>
          <ul className="list-disc list-inside text-gray-700">
            {chapters
              .slice()
              .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0))
              .map((c) => (
                <li key={c.chapterId ?? c.orderNum}>
                  {c.orderNum != null ? `${c.orderNum}. ` : ''}
                  {c.chapterName}
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* ── 생성·수정 일시 (선택) ── */}
      {(createdAt || updatedAt) && (
        <div className="text-xs text-gray-500">
          {createdAt && (
            <span>
              개설: {new Date(createdAt).toLocaleDateString()}&nbsp;
            </span>
          )}
          {updatedAt && (
            <span>
              마지막 수정: {new Date(updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      )}
    </header>
  );
};

export default LectureHeader;
