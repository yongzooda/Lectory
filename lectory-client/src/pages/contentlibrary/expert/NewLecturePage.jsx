import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createLecture } from '../../../api/expertApi';

const NewLecturePage = () => {
  const [searchParams] = useSearchParams();
  const expertId = searchParams.get('expertId');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    thumbnail: '',
    title: '',
    description: '',
    fileUrl: '',
    isPaid: false,
    tags: '' // comma separated tag names
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        expertId,
        thumbnail: formData.thumbnail,
        title: formData.title,
        description: formData.description,
        fileUrl: formData.fileUrl,
        isPaid: formData.isPaid,
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t)
      };
      const res = await createLecture(payload);
      const { lectureRoomId } = res.data;
      navigate(`/library/expert/${lectureRoomId}?expertId=${expertId}`);
    } catch (err) {
      console.error(err);
      setError('강의실 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-lecture-page container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">새 강의실 등록</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">썸네일 URL</label>
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
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
            required
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
            required
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
        <div>
          <label className="block mb-1">태그 (콤마로 구분)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Java, Spring, React"
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </form>
    </div>
  );
};

export default NewLecturePage;
