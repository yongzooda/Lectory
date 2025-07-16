import React, { useState, useEffect } from 'react';

const ChapterForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    chapterName: '',
    expectedTime: '',
    orderNum: 1,
    videoUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        chapterName: initialData.chapterName || '',
        expectedTime: initialData.expectedTime || '',
        orderNum: initialData.orderNum || 1,
        videoUrl: initialData.videoUrl || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'orderNum' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="chapter-form bg-white p-4 border rounded-lg mb-6">
      <div className="mb-4">
        <label className="block mb-1">챕터 이름</label>
        <input
          type="text"
          name="chapterName"
          value={formData.chapterName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">예상 시간 (HH:MM:SS)</label>
        <input
          type="text"
          name="expectedTime"
          value={formData.expectedTime}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="00:30:00"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">순서 번호</label>
        <input
          type="number"
          name="orderNum"
          value={formData.orderNum}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="1"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">비디오 URL</label>
        <input
          type="text"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="btn-primary"
        >
          {initialData ? '수정 완료' : '추가'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default ChapterForm;
