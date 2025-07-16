import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { listMyLectures, searchMyLectures } from '../../api/expertApi';
import LectureCard from '../../components/contentlibrary/common/LectureCard';
import Pagination from '../../components/contentlibrary/common/Pagination';

const ExpertListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const expertId = searchParams.get('expertId') || '';
  const keyword = searchParams.get('keyword') || '';
  const tags = searchParams.getAll('tags');
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);

  const [rooms, setRooms] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLectures() {
      setLoading(true);
      try {
        const params = { expertId, page, size, sort };
        let res;
        if (keyword || (tags && tags.length)) {
          res = await searchMyLectures({ ...params, keyword, tags });
        } else {
          res = await listMyLectures(params);
        }
        setRooms(res.data.content);
        setPageInfo(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLectures();
  }, [expertId, page, size, sort, keyword, tags]);

  const handleCardClick = (id) => {
    navigate(`/library/expert/${id}?expertId=${expertId}`);
  };

  const handleNew = () => {
    navigate(`/library/expert/new?expertId=${expertId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="expert-list-page container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">내 강의 목록</h1>
        <button onClick={handleNew} className="btn-primary">
          새 강의실 등록
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {rooms.map(r => (
          <LectureCard
            key={r.lectureRoomId}
            title={r.title}
            thumbnail={r.thumbnail}
            expertName={r.expertName}
            enrollmentCount={r.enrollmentCount}
            isPaid={r.isPaid}
            onClick={() => handleCardClick(r.lectureRoomId)}
          />
        ))}
      </div>
      {pageInfo && (
        <Pagination
          pageInfo={pageInfo}
          basePath="/library/expert"
          query={{ expertId, keyword, tags, sort }}
        />
      )}
    </div>
  );
};

export default ExpertListPage;
