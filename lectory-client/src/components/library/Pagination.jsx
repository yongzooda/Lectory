// lectory-client/src/components/library/Pagination.jsx
import styles from '../../assets/css/contentLibrary.module.css';

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 범용 페이징 컴포넌트 – 서버 페이징 응답 PageDto 기반
 *
 * props
 *  • pageInfo : {
 *        pageNumber : Number   (현재 0-based)
 *        totalPages : Number
 *        pageSize   : Number
 *    }
 *  • basePath : String            (예: "/library")
 *  • query    : Record<string, any>  – page / size 제외, 그대로 유지
 */
const Pagination = ({ pageInfo, basePath, query = {} }) => {
  if (!pageInfo || pageInfo.totalPages <= 1) return null;

  const { pageNumber, totalPages, pageSize } = pageInfo;

  /* URL 생성기 : 기존 쿼리 + page/size 갱신 */
  const buildUrl = (page) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v == null || v === '') return;
      Array.isArray(v) ? v.forEach((x) => params.append(k, x)) : params.append(k, v);
    });
    params.set('page', page);
    params.set('size', pageSize);
    return `${basePath}?${params.toString()}`;
  };

  /* 페이지 번호 목록 (최대 5개 창) */
  const window = 2;                      // 현재 기준 ±2
  const start = Math.max(0, pageNumber - window);
  const end   = Math.min(totalPages - 1, pageNumber + window);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="flex justify-center items-center space-x-1 mt-6 select-none">
      {/* 이전 */}
      {pageNumber > 0 && (
        <Link
          to={buildUrl(pageNumber - 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          이전
        </Link>
      )}

      {/* 번호 */}
      {pages.map((p) => (
        <Link
          key={p}
          to={buildUrl(p)}
          className={`px-3 py-1 border rounded ${
            p === pageNumber
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {p + 1}
        </Link>
      ))}

      {/* 다음 */}
      {pageNumber < totalPages - 1 && (
        <Link
          to={buildUrl(pageNumber + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          다음
        </Link>
      )}
    </nav>
  );
};

export default Pagination;
