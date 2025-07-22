// src/pages/contentlibrary/student/LibraryHome.jsx
import styles from '../../../assets/css/contentLibrary.module.css';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  listLectureRooms,
  searchLectureRooms,
  fetchAllTags,
} from "../../../api/studentApi";

import SearchBar    from "../../../components/library/SearchBar";
import TagFilterBar from "../../../components/library/TagFilterBar";
import SortDropdown from "../../../components/library/SortDropdown";
import LectureCard  from "../../../components/library/LectureCard";
import Pagination   from "../../../components/library/Pagination";

/**
 * 수강생용 콘텐츠 라이브러리 메인
 * URL: /library
 */
const StudentLibraryHome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL 쿼리에서 페이징·정렬·검색어·태그 가져오기
  const search = searchParams.get("search") || "";
  const sort   = searchParams.get("sort")   || "createdAt,desc";
  const page   = parseInt(searchParams.get("page") || "0",  10);
  const size   = parseInt(searchParams.get("size") || "10", 10);

  // 다중 태그 파라미터
  const tags   = useMemo(() => searchParams.getAll("tags"), [searchParams]);
  const tagKey = tags.slice().sort().join(",");

  // 컴포넌트 상태
  const [rooms,    setRooms]    = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [allTags,  setAllTags]  = useState([]);

  // 목록 / 검색 API 호출
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const base = { page, size, sort };
      const res  = (search || tags.length)
        ? await searchLectureRooms({ ...base, search, tags })
        : await listLectureRooms(base);

      setRooms(res.data.content ?? []);
      setPageInfo(res.data);
    } catch (err) {
      console.error(err);
      alert("목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [page, size, sort, search, tagKey]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 태그 필터 바용 풀 조회
  useEffect(() => {
    fetchAllTags()
      .then((res) => setAllTags(res.data))
      .catch(console.error);
  }, []);

  // 상세 페이지로 이동
  const goDetail = (lectureRoomId) => {
    navigate(`/library/${lectureRoomId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-10">
      {/* 검색창 */}
      <SearchBar
        initial={search}
        tags={tags}
        sort={sort}
        basePath="/library"
      />

      {/* 태그 필터 */}
      <TagFilterBar
        selected={tags}
        allTags={allTags}
        search={search}
        sort={sort}
        basePath="/library"
      />

      {/* 정렬 드롭다운 */}
      <div className="flex justify-end">
        <SortDropdown
          search={search}
          tags={tags}
          value={sort}
          basePath="/library"
        />
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="text-center py-20">Loading…</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          강의실이 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.map((r) => (
              <LectureCard
                key={r.lectureRoomId}
                coverImageUrl={r.coverImageUrl}
                title={r.title}
                expertName={r.expertName}
                enrollmentCount={r.enrollmentCount}
                isPaid={r.isPaid}
                isEnrolled={r.isEnrolled}
                tags={r.tags}
                onClick={() => goDetail(r.lectureRoomId)}
              />
            ))}
          </div>

          {pageInfo && (
            <Pagination
              pageInfo={pageInfo}
              basePath="/library"
              query={{ search, tags, sort }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default StudentLibraryHome;
