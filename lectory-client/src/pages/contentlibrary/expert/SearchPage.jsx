import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ExpertListPage from './ListPage';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const expertId = searchParams.get('expertId') || '';
  const initialKeyword = searchParams.get('keyword') || '';
  const initialTags = searchParams.getAll('tags').join(',') || '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const [tags, setTags] = useState(initialTags);

  const handleSearch = (e) => {
    e.preventDefault();
    const tagList = tags.split(',').map(t => t.trim()).filter(t => t);
    const params = new URLSearchParams();
    params.append('expertId', expertId);
    if (keyword) params.append('keyword', keyword);
    tagList.forEach(t => params.append('tags', t));
    navigate(`/library/expert/search?${params.toString()}`);
  };

  return (
    <div className="expert-search-page container mx-auto p-4">
      <form onSubmit={handleSearch} className="flex mb-4 space-x-2">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="강의실 제목 검색"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="필터 태그 (콤마로 구분)"
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="btn-primary">
          검색
        </button>
      </form>
      {/* 검색 결과 리스트 재사용 */}
      <ExpertListPage />
    </div>
  );
};

export default SearchPage;
