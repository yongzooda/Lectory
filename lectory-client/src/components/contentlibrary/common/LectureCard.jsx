import React from 'react';

const LectureCard = ({
  title,
  thumbnail,
  expertName,
  enrollmentCount,
  isPaid,
  onClick
}) => {
  return (
    <div
      className="lecture-card cursor-pointer border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">강사: {expertName}</p>
        <p className="text-sm text-gray-600 mb-1">
          수강생: {enrollmentCount}
        </p>
        {isPaid && (
          <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
            유료
          </span>
        )}
      </div>
    </div>
  );
};

export default LectureCard;
