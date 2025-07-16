import React from 'react';

const ChapterList = ({ chapters }) => {
  if (!chapters || chapters.length === 0) {
    return <p className="text-center text-gray-500">등록된 챕터가 없습니다.</p>;
  }

  return (
    <div className="chapter-list space-y-4">
      {chapters.map((chapter, index) => (
        <div
          key={index}
          className="chapter-item p-4 border rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold">{chapter.chapterName}</h3>
          <p className="mt-1 text-sm text-gray-600">
            예상 소요시간: {chapter.expectedTime}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChapterList;
