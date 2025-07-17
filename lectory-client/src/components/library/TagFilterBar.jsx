// lectory-client/src/components/library/TagFilterBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 라이브러리 목록 – 태그 필터 바
 *
 * props
 *  • memberId : String|Number          ― URL 유지용 (필수)
 *  • selected : Array<string>          ― 현재 선택된 태그
 *  • allTags  : Array<string>          ― 서버가 내려준 전체 태그
 *  • search   : String                 ― 현재 검색어
 *  • sort     : String                 ― 현재 정렬 값
 *  • basePath : String                 ― 경로 (기본 '/library')
 */
const TagFilterBar = ({
  memberId,
  selected = [],
  allTags = [],
  search = '',
  sort = 'createdAt,desc',
  basePath = '/library',
}) => {
  /* URL 생성 (태그 토글) */
  const urlFor = (tag) => {
    const next = selected.includes(tag)
      ? selected.filter((t) => t !== tag)   // 제거
      : [...selected, tag];                // 추가

    const qs = new URLSearchParams();
    qs.set('memberId', memberId);
    if (search) qs.set('search', search);
    next.forEach((t) => qs.append('tags', t));
    qs.set('sort', sort);
    qs.set('page', 0);

    return `${basePath}?${qs.toString()}`;
  };

  /* '전체' URL (태그 초기화) */
  const allUrl = () => {
    const qs = new URLSearchParams();
    qs.set('memberId', memberId);
    if (search) qs.set('search', search);
    qs.set('sort', sort);
    qs.set('page', 0);
    return `${basePath}?${qs.toString()}`;
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap mb-6">
      {/* 전체 버튼 */}
      <Link
        to={allUrl()}
        className={`inline-block px-4 py-2 mr-2 rounded-full border ${
          selected.length === 0
            ? 'bg-blue-600 text-white'
            : 'hover:bg-gray-100'
        }`}
      >
        전체
      </Link>

      {/* 태그 버튼들 */}
      {allTags.map((tag) => (
        <Link
          key={tag}
          to={urlFor(tag)}
          className={`inline-block px-4 py-2 mr-2 rounded-full border ${
            selected.includes(tag)
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
};

export default TagFilterBar;
