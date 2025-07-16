import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { listLectureRooms, searchLectureRooms } from '../../api/studentApi';
import LectureCard from '../../components/contentlibrary/common/LectureCard';
import Pagination from '../../components/contentlibrary/common/Pagination';

const ListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const memberId = searchParams.get('memberId') || '';
  const search = searchParams.get('search') || '';
  const tags = searchParams.getAll('tags');
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);

  const [rooms, setRooms] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      try {
        const params = { memberId, page, size, sort };
        let res;
        if (search || (tags && tags.length)) {
          res = await searchLectureRooms({ ...params, search, tags });
        } else {
          res = await listLectureRooms(params);
        }
        setRooms(res.data.content);
        setPageInfo(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, [memberId, page, size, sort, search, tags]);

  const handleCardClick = (id) => {
    navigate(`/library/${id}?memberId=${memberId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="list-page container mx-auto p-4">
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
          basePath="/library"
          query={{ memberId, search, tags, sort }}
        />
      )}
    </div>
  );
};

export default ListPage;
