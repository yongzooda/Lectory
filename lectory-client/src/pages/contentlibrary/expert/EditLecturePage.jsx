import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getLectureDetail as getExpertLectureDetail, updateLecture } from '../../../api/expertApi';

const EditLecturePage = () => {
  const { lectureRoomId } = useParams();
  const [searchParams] = useSearchParams();
  const expertId = searchParams.get('expertId');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    thumbnail: '',
    title: '',
    description: '',
    fileUrl: '',
    isPaid: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await getExpertLectureDetail({ lectureRoomId, expertId });
        const data = res.data;
        setFormData({
          thumbnail: data.coverImageUrl || '',
          title: data.title || '',
          description: data.description || '',
          fileUrl: data.fileUrl || '',
          isPaid: data.isPaid || false
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [lectureRoomId, expertId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLecture({ lectureRoomId, expertId, ...formData });
      navigate(`/library/expert/${lectureRoomId}?expertId=${expertId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-lecture-page container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">강의실 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">썸네일 URL</label>
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">제목</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div>
          <label className="block mb-1">자료 파일 URL</label>
          <input
            type="text"
            name="fileUrl"
            value={formData.fileUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPaid"
            checked={formData.isPaid}
            onChange={handleChange}
            className="mr-2"
          />
          <label>유료 강의실 여부</label>
        </div>
        <button
          type="submit"
          className="btn-primary"
        >
          저장하기
        </button>
      </form>
    </div>
  );
};

export default EditLecturePage;
