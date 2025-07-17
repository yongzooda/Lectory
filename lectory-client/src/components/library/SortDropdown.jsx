// lectory-client/src/components/library/SortDropdown.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 라이브러리 목록 정렬 드롭다운
 *
 * props
 *  • memberId : String | Number           ─ URL 유지용 (필수)
 *  • search   : String                    ─ 현재 검색어
 *  • tags     : Array<string>             ─ 현재 선택된 태그
 *  • value    : String                    ─ 선택된 정렬 값
 *  • basePath : String                    ─ 경로 (기본 '/library')
 */
const OPTIONS = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'popularity,desc', label: '수강자순' },
  { value: 'title,asc', label: '제목순(A→Z)' },
];

const SortDropdown = ({
  memberId,
  search = '',
  tags = [],
  value = 'createdAt,desc',
  basePath = '/library',
}) => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const qs = new URLSearchParams();
    qs.set('memberId', memberId);
    if (search) qs.set('search', search);
    tags.forEach((t) => qs.append('tags', t));
    qs.set('sort', e.target.value);
    qs.set('page', 0); // 정렬 변경 시 첫 페이지

    navigate(`${basePath}?${qs.toString()}`);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

export default SortDropdown;
