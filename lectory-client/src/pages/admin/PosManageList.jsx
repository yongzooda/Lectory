import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance'; // axiosInstance 가져오기

const PosManageList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('로그인 후 이용해주세요.');
      navigate('/unauthorized');
      return;
    }

    // axios를 이용한 요청
    api.get('/admin/manage-posts')
      .then((response) => {
        setPosts(response.data);
      })
      .catch((err) => {
        console.error('게시글 가져오기 실패:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          alert('관리자 권한이 필요합니다.');
          navigate('/unauthorized');
        } else {
          setError('게시글을 불러오는 데 실패했습니다.');
        }
      });
  }, [navigate]);

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
            <th className="border px-3 py-2">게시글 제목</th>
            <th className="border px-3 py-2">게시글 작성자 ID</th>
            <th className="border px-3 py-2">게시글 생성 일자</th>
            <th className="border px-3 py-2">신고 여부</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">게시글이 없습니다.</td>
            </tr>
          ) : (
            posts.map((post, index) => (
              <tr
                key={post.postId}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/posts/${post.postId}`)}
              >
                <td className="border px-3 py-2 text-center">{index}</td>
                <td className="border px-3 py-2 text-center">{post.title}</td>
                <td className="border px-3 py-2 text-center">{post.authorEmail}</td>
                <td className="border px-3 py-2 text-center">{formatDate(post.createdAt)}</td>
                <td className="border px-3 py-2 text-center">{post.reported === true ? 'O' : 'X'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PosManageList;