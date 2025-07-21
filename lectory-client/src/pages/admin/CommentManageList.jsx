import React, { useEffect, useState } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import { getAllCommnets } from "../../api/adminApi.js"; // ✅ 이 함수 사용

const CommentManageList = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllCommnets()
      .then((data) => {
        setComments(data);
        setError(null);
      })
      .catch((err) => {
        console.error("댓글 가져오기 실패", err);
        setError("댓글 정보를 불러오는 데 실패했습니다.");
        return;
      });
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
              onClick={() => navigate(`/posts/${comment.postId}`)}
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
