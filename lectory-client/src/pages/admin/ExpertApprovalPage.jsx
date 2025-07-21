import React, { useEffect, useState } from 'react';

const ExpertApprovalPage = () => {
  const [experts, setExperts] = useState([]);
  const [error, setError] = useState('');

  const fetchExperts = () => {
    fetch('/api/admin/expert-approval')
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          const msg = await res.text();
          throw new Error(msg);
        }
        return res.json();
      })
      .then(setExperts)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleApproval = (expertId, status) => {
    fetch('/api/admin/expert-approval', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expertId, status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('처리에 실패했습니다.');
        if (res.ok)  alert("요청을 완료했습니다! ✅");
        fetchExperts(); // 목록 다시 불러오기
      })
      .catch((err) => alert(err.message));
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${d.toTimeString().substring(0, 8)}`;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Expert Approval</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">번호</th>
            <th className="border px-3 py-2">전문가 아이디</th>
            <th className="border px-3 py-2">포트폴리오</th>
            <th className="border px-3 py-2">회원 가입 일자</th>
            <th className="border px-3 py-2">가입 승인</th>
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
                <td className="border px-3 py-2">{expert.email}</td>
                <td className="border px-3 py-2 text-blue-600 underline truncate max-w-[200px]">
                  <a href={expert.portfolioFileUrl} target="_blank" rel="noreferrer">포트폴리오 보기</a>
                </td>
                <td className="border px-3 py-2">{formatDate(expert.createdAt)}</td>
                <td className="border px-3 py-2 space-x-2">
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
  );
};

export default ExpertApprovalPage;
