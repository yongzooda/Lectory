import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ListPage from './ListPage';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 쿼리 파라미터에서 memberId 및 기존 검색어 읽기
  const memberId = searchParams.get('memberId') || '';
  const initialSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(initialSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색어를 쿼리파라미터로 설정하고 ListPage로 이동
    navigate(
      `/library/search?memberId=${memberId}&search=${encodeURIComponent(searchInput)}`
    );
  };

  return (
    <div className="search-page container mx-auto p-4">
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="강의실 검색"
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="btn-primary ml-2">
          검색
        </button>
      </form>

      {/* 검색 결과 리스트 재사용 */}
      <ListPage />
    </div>
  );
};

export default SearchPage;
