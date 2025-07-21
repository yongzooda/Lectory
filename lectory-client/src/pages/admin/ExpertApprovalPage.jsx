import React, { useEffect, useState } from 'react';
import AdminNavigation from './AdminNavigation';
import api from '../../api/axiosInstance';

const ExpertApprovalPage = () => {
  const [experts, setExperts] = useState([]);
  const [error, setError] = useState('');

  const fetchExperts = async () => {
    try {
      const res = await api.get('/admin/expert-approval');
      setExperts(res.data);
    } catch (err) {
      setError(err.response?.data || '전문가 목록 불러오기 실패');
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleApproval = async (expertId, status) => {
    try {
      await api.patch('/admin/expert-approval', { expertId, status });
      alert('요청을 완료했습니다!');
      fetchExperts();
    } catch (err) {
      alert(err.response?.data || '처리에 실패했습니다.');
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${d.toTimeString().substring(0, 8)}`;
  };

  return (
    <div className="p-8">
      <AdminNavigation />
      <br />
      <h1 className="text-2xl font-bold mb-4">Expert Approval</h1>
      <div className="p-6 bg-white rounded-xl shadow">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-center">번호</th>
              <th className="border px-3 py-2 text-center">전문가 아이디</th>
              <th className="border px-3 py-2 text-center">포트폴리오</th>
              <th className="border px-3 py-2 text-center">회원 가입 일자</th>
              <th className="border px-3 py-2 text-center">가입 승인</th>
            </tr>
          </thead>
          <tbody>
            {experts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">승인 대기 중인 전문가가 없습니다.</td>
              </tr>
            ) : (
              experts.map((expert, idx) => (
                <tr key={expert.userId}>
                  <td className="border px-3 py-2 text-center">{idx}</td>
                  <td className="border px-3 py-2 text-center">{expert.email}</td>
                  <td className="border px-3 py-2 text-center underline truncate max-w-[200px]">
                    <a className="text-blue-600" href={expert.portfolioFileUrl} target="_blank" rel="noreferrer">포트폴리오 보기</a>
                  </td>
                  <td className="border px-3 py-2 text-center">{formatDate(expert.createdAt)}</td>
                  <td className="border px-3 py-2 space-x-2 text-center">
                    <button
                      onClick={() => handleApproval(expert.userId, 'APPROVED')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleApproval(expert.userId, 'PENDING')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      보류
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpertApprovalPage;