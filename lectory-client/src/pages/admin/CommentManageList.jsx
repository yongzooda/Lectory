import React, { useEffect, useState } from 'react';
import { useHref, useNavigate } from 'react-router-dom';

const CommentManageList = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/admin/manage-comments')
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          const msg = await res.text();
          throw new Error(msg);
        }
        return res.json();
      })
      .then(setComments)
      .catch((err) => setError(err.message));
  }, []);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${d.toTimeString().substring(0, 8)}`;
  };

  return (
    <div className="bg-white shadow rounded-xl p-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">번호</th>
            <th className="border px-3 py-2">댓글 내용</th>
            <th className="border px-3 py-2">작성자 ID</th>
            <th className="border px-3 py-2">작성 일자</th>
            <th className="border px-3 py-2">신고 여부</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">댓글이 없습니다.</td>
            </tr>
          ) : (
            comments.map((comment, index) => (
              <tr key={comment.commentId} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/admin/posts/${comment.postId}`)}
              >
                <td className="border px-3 py-2 text-center">{comment.commentId}</td>
                <td className="border px-3 py-2">{comment.content}</td>
                <td className="border px-3 py-2">{comment.email}</td>
                <td className="border px-3 py-2">{formatDate(comment.createdAt)}</td>
                <td className="border px-3 py-2 text-center">{comment.reported ? 'O' : 'X'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommentManageList;
