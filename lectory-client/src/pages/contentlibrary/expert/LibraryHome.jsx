// src/pages/contentlibrary/expert/ExpertLibraryHome.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  listMyLectures,
  searchMyLectures,
  fetchAllTags,
} from '../../../api/expertApi';

import SearchBar    from '../../../components/library/SearchBar';
import TagFilterBar from '../../../components/library/TagFilterBar';
import SortDropdown from '../../../components/library/SortDropdown';
import LectureCard  from '../../../components/library/LectureCard';
import Pagination   from '../../../components/library/Pagination';

/**
 * 전문가용 콘텐츠 라이브러리 메인
 * URL: /library/expert
 */
const ExpertLibraryHome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const sort   = searchParams.get('sort')   || 'createdAt,desc';
  const page   = parseInt(searchParams.get('page') || '0', 10);
  const size   = parseInt(searchParams.get('size') || '10', 10);

  const tags   = useMemo(() => searchParams.getAll('tags'), [searchParams]);
  const tagKey = tags.slice().sort().join(',');

  const [lectures, setLectures] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [allTags,  setAllTags]  = useState([]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const base = { page, size, sort };
      const res  = (search || tags.length)
        ? await searchMyLectures({ ...base, keyword: search, tags })
        : await listMyLectures(base);

      setLectures(res.data.content ?? []);
      setPageInfo(res.data);
    } catch (err) {
      console.error(err);
      alert('목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, size, sort, search, tagKey]);

  useEffect(() => { fetchList(); }, [fetchList]);

  useEffect(() => {
    fetchAllTags()
      .then(res => setAllTags(res.data))
      .catch(console.error);
  }, []);

  const goDetail = (lectureRoomId) => {
    navigate(`/library/expert/${lectureRoomId}`);
  };

  const goNew = () => {
    navigate(`/library/expert/new`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">내 강의실</h1>
        <button
          onClick={goNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          새 강의실 등록
        </button>
      </div>

      <SearchBar
        initial={search}
        tags={tags}
        sort={sort}
        basePath="/library/expert"
      />

      <TagFilterBar
        selected={tags}
        allTags={allTags}
        search={search}
        sort={sort}
        basePath="/library/expert"
      />

      <div className="flex justify-end">
        <SortDropdown
          search={search}
          tags={tags}
          value={sort}
          basePath="/library/expert"
        />
      </div>

      {loading ? (
        <div className="text-center py-20">Loading…</div>
      ) : lectures.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          강의실이 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectures.map((lec) => (
              <LectureCard
                key={lec.lectureRoomId}
                thumbnail={lec.thumbnail}
                title={lec.title}
                expertName={lec.expertName}
                enrollmentCount={lec.enrollmentCount}
                isPaid={lec.isPaid}
                isEnrolled={lec.isEnrolled}
                tags={lec.tags}
                onClick={() => goDetail(lec.lectureRoomId)}
              />
            ))}
          </div>

          {pageInfo && (
            <Pagination
              pageInfo={pageInfo}
              basePath="/library/expert"
              query={{ search, tags, sort }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExpertLibraryHome;
