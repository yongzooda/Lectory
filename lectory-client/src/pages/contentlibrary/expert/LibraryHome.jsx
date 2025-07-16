// lectory-client/src/pages/contentlibrary/expert/LibraryHome.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  listMyLectures,
  searchMyLectures,
} from '../../../api/expertApi';

import SearchBar    from '../../../components/library/SearchBar';
import TagFilterBar from '../../../components/library/TagFilterBar';
import SortDropdown from '../../../components/library/SortDropdown';
import LectureCard  from '../../../components/library/LectureCard';
import Pagination   from '../../../components/library/Pagination';

/**
 * 전문가용 콘텐츠 라이브러리 메인
 * URL: /library/expert?expertId=#
 */
const ExpertLibraryHome = () => {
  /* ─── URL 파라미터 ─── */
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const expertId = searchParams.get('expertId') || '';
  const search   = searchParams.get('keyword')  || '';        // 검색 파라미터 이름을 keyword 로 통일
  const sort     = searchParams.get('sort')     || 'createdAt,desc';
  const page     = parseInt(searchParams.get('page') || '0', 10);
  const size     = parseInt(searchParams.get('size') || '10', 10);

  /* tags 는 다중 파라미터 */
  const tags = useMemo(() => searchParams.getAll('tags'), [searchParams]);
  const tagKey = tags.slice().sort().join(',');

  /* ─── 상태 ─── */
  const [lectures, setLectures] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [allTags,  setAllTags]  = useState([]);      // TODO: 백엔드 태그 목록 API 연결

  /* ─── 데이터 로딩 ─── */
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const params = { expertId, page, size, sort };
      const res = (search || tags.length)
        ? await searchMyLectures({ ...params, keyword: search, tags })
        : await listMyLectures(params);

      setLectures(res.data.content ?? []);
      setPageInfo(res.data);
    } catch (err) {
      console.error(err);
      alert('목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [expertId, page, size, sort, search, tagKey]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  /* ─── 카드 클릭 ─── */
  const goDetail = (id) => {
    navigate(`/library/expert/${id}?expertId=${expertId}`);
  };

  /* ─── 신규 강의실 ─── */
  const goNew = () => {
    navigate(`/library/expert/new?expertId=${expertId}`);
  };

  /* ─── 렌더 ─── */
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* 헤더 영역 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">내 강의실</h1>
        <button
          onClick={goNew}
          className="self-start md:self-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          새 강의실 등록
        </button>
      </div>

      {/* 검색 + 태그 + 정렬 */}
      <SearchBar
        memberId={expertId}
        initial={search}
        tags={tags}
        sort={sort}
        basePath="/library/expert"
      />
      <TagFilterBar
        memberId={expertId}
        selected={tags}
        allTags={allTags}
        search={search}
        sort={sort}
        basePath="/library/expert"
      />
      <div className="flex justify-end">
        <SortDropdown
          memberId={expertId}
          search={search}
          tags={tags}
          value={sort}
          basePath="/library/expert"
        />
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="text-center py-20">Loading…</div>
      ) : lectures.length === 0 ? (
        <div className="text-center py-20 text-gray-500">강의실이 없습니다.</div>
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
                onClick={() => goDetail(lec.lectureRoomId)}
              />
            ))}
          </div>

          {pageInfo && (
            <Pagination
              pageInfo={pageInfo}
              basePath="/library/expert"
              query={{ expertId, keyword: search, tags, sort }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExpertLibraryHome;
