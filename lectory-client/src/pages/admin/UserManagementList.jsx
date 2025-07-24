import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';
import api from '../../api/axiosInstance';

const UserManagementList = () => {
  const [type, setType] = useState('FREE');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('로그인 후 이용해주세요.');
      navigate('/unauthorized');
      return;
    }

    const fetchUsers = async () => {
      try {
        const url = type === 'EXPERT' ? '/admin/experts' : `/admin/students?type=${type}`;
        const res = await api.get(url);
        setData(res.data);
        setError('');
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          alert('권한이 없습니다.');
          navigate('/unauthorized');
        } else {
          setError(err.response?.data?.message || '회원 정보 불러오기 실패');
        }
      }
    };
    fetchUsers();
  }, [type, navigate]);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${d.toTimeString().substring(0, 8)}`;
  };

  return (
    <div>
      <div className="p-6 bg-white shadow rounded-xl">
        {/*         <h2 className="text-xl font-bold mb-4">회원 관리</h2> */}
        <div className="flex gap-4 mb-4">
          <button className={`px-4 py-2 rounded ${type === 'FREE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setType('FREE')}>무료 회원</button>
          <button className={`px-4 py-2 rounded ${type === 'PAID' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setType('PAID')}>유료 회원</button>
          <button className={`px-4 py-2 rounded ${type === 'EXPERT' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setType('EXPERT')}>전문가</button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 ">번호</th>
              <th className="border px-3 py-2 ">{type === 'EXPERT' ? '전문가 아이디' : '회원 아이디'}</th>
              <th className="border px-3 py-2 ">닉네임</th>
              <th className="border px-3 py-2 ">회원 가입 일자</th>
              {type === 'EXPERT' && <th className="border px-3 py-2">가입 승인 상태</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={type === 'EXPERT' ? 5 : 4} className="text-center py-6 text-gray-500">
                  조회된 회원이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((user, index) => (
                <tr key={user.userId}>
                  <td className="border px-3 py-2 text-center">{index}</td>
                  <td className="border px-3 py-2 text-center">{user.email}</td>
                  <td className="border px-3 py-2 text-center">{user.nickname}</td>
                  <td className="border px-3 py-2 text-center">{formatDate(user.createdAt)}</td>
                  {type === 'EXPERT' && (
                    <td className="border px-3 py-2 text-center">{user.approvalStatus}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementList;