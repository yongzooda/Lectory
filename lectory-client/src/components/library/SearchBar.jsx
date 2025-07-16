// lectory-client/src/components/library/SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 라이브러리 목록 상단 검색창
 *
 * props
 *  • memberId : String | Number          ─ URL 유지용 (필수)
 *  • initial  : String                   ─ 초기 검색어 (기본 '')
 *  • tags     : Array<string>            ─ 현재 선택된 태그 (URL 유지)
 *  • sort     : String                   ─ 정렬 값 (기본 'createdAt,desc')
 *  • basePath : String                   ─ 경로 (기본 '/library')
 */
const SearchBar = ({
  memberId,
  initial = '',
  tags = [],
  sort = 'createdAt,desc',
  basePath = '/library',
}) => {
  const [keyword, setKeyword] = useState(initial);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const qs = new URLSearchParams();
    qs.set('memberId', memberId);
    if (keyword.trim()) qs.set('search', keyword.trim());
    tags.forEach((t) => qs.append('tags', t));
    if (sort) qs.set('sort', sort);
    qs.set('page', 0); // 검색 시 첫 페이지부터

    navigate(`${basePath}?${qs.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-xl mx-auto mb-6"
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="강의 제목 또는 강사명을 검색하세요"
        className="flex-1 border rounded-l-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-md"
      >
        검색
      </button>
    </form>
  );
};

export default SearchBar;
