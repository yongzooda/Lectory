import React, { useState, useEffect } from 'react';

const LectureForm = ({ initialData, onSubmit, onCancel }) => {
  // initialData: { thumbnail, title, description, fileUrl, isPaid, tags: [] }
  const [formData, setFormData] = useState({
    thumbnail: '',
    title: '',
    description: '',
    fileUrl: '',
    isPaid: false,
    tags: ''  // comma separated string
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        thumbnail: initialData.thumbnail || '',
        title: initialData.title || '',
        description: initialData.description || '',
        fileUrl: initialData.fileUrl || '',
        isPaid: initialData.isPaid || false,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // split tags into array
    const payload = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t)
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="lecture-form bg-white p-4 border rounded-lg mb-6">
      <div className="mb-4">
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
      <div className="mb-4">
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
      <div className="mb-4">
        <label className="block mb-1">설명</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="4"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">자료 파일 URL</label>
        <input
          type="text"
          name="fileUrl"
          value={formData.fileUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="isPaid"
          checked={formData.isPaid}
          onChange={handleChange}
          className="mr-2"
        />
        <label>유료 강의실 여부</label>
      </div>
      <div className="mb-6">
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
      <div className="flex space-x-4">
        <button type="submit" className="btn-primary">
          {initialData ? '수정 완료' : '등록하기'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-outline">
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default LectureForm;
