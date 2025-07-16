import React from 'react';
import { Link } from 'react-router-dom';

const Pagination = ({ pageInfo, basePath, query }) => {
  const { pageNumber, totalPages, pageSize } = pageInfo;

  const generateUrl = (page) => {
    const params = new URLSearchParams();
    // query 객체에 포함된 키를 URLSearchParams에 추가
    Object.entries(query).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach(v => params.append(key, v));
      } else if (val != null && val !== '') {
        params.append(key, val);
      }
    });
    // 페이지 정보 추가
    params.append('page', page);
    params.append('size', pageSize);
    return `${basePath}?${params.toString()}`;
  };

  // 페이지 숫자 배열 생성
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <nav className="pagination flex justify-center space-x-2 my-4">
      {/* 이전 페이지 링크 */}
      {pageNumber > 0 && (
        <Link
          to={generateUrl(pageNumber - 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          이전
        </Link>
      )}

      {/* 페이지 번호 링크 */}
      {pages.map(i => (
        <Link
          key={i}
          to={generateUrl(i)}
          className={`px-3 py-1 border rounded ${i === pageNumber ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          {i + 1}
        </Link>
      ))}

      {/* 다음 페이지 링크 */}
      {pageNumber < totalPages - 1 && (
        <Link
          to={generateUrl(pageNumber + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          다음
        </Link>
      )}
    </nav>
  );
};

export default Pagination;
