import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  getLectureDetail,
  createChapter,
  updateChapter,
  deleteChapter
} from '../../api/expertApi';
import ChapterForm from '../../components/contentlibrary/expert/ChapterForm';

const ManageChaptersPage = () => {
  const { lectureRoomId } = useParams();
  const [searchParams] = useSearchParams();
  const expertId = searchParams.get('expertId');

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const res = await getLectureDetail({ lectureRoomId, expertId });
      // detail.chapters contains [{ lectureId, chapterName, expectedTime, videoUrl, orderNum }]
      setChapters(res.data.chapters);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [lectureRoomId, expertId]);

  const handleAdd = () => {
    setCurrentChapter(null);
    setIsEditing(true);
  };

  const handleEdit = (chapter) => {
    setCurrentChapter(chapter);
    setIsEditing(true);
  };

  const handleDelete = async (chapterId) => {
    try {
      await deleteChapter({ chapterId, expertId });
      fetchChapters();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (currentChapter) {
        await updateChapter({ chapterId: currentChapter.lectureId, expertId, ...data });
      } else {
        await createChapter({ lectureRoomId, expertId, ...data });
      }
      setIsEditing(false);
      setCurrentChapter(null);
      fetchChapters();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentChapter(null);
  };

  if (loading) return <div>Loading chapters...</div>;

  return (
    <div className="manage-chapters-page container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">챕터 관리</h1>
      <button onClick={handleAdd} className="btn-primary mb-4">
        챕터 추가
      </button>

      {isEditing && (
        <ChapterForm
          initialData={currentChapter}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <ul className="space-y-4">
        {chapters.map((ch) => (
          <li key={ch.lectureId} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{ch.chapterName}</h2>
                <p>예상시간: {ch.expectedTime}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(ch)}
                  className="btn-outline"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(ch.lectureId)}
                  className="btn-danger"
                >
                  삭제
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageChaptersPage;
