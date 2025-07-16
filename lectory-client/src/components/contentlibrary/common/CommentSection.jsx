import React from 'react';

const CommentSection = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p className="text-center text-gray-500">등록된 수강평이 없습니다.</p>;
  }

  return (
    <div className="comment-section space-y-4">
      {comments.map((comment) => (
        <div key={comment.commentId} className="comment-item p-4 border rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{comment.author}</span>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-gray-800">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
