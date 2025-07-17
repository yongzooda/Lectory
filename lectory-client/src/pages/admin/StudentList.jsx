import React, { useEffect, useState } from 'react';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState(null); // null | "FREE" | "PAID"

  useEffect(() => {
    let url = '/admin/students';
    if (filter) {
      url += `?type=${filter}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error('학생 목록 불러오기 실패:', err));
  }, [filter]);

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">수강생 목록</h2>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${!filter ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter(null)}
        >
          전체
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'FREE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('FREE')}
        >
          무료 회원
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'PAID' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('PAID')}
        >
          유료 회원
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">번호</th>
            <th className="border px-4 py-2">회원 아이디</th>
            <th className="border px-4 py-2">닉네임</th>
            <th className="border px-4 py-2">회원 가입 일자</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500">조회된 회원이 없습니다.</td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={student.userId}>
                <td className="border px-4 py-2 text-center">{index}</td>
                <td className="border px-4 py-2">{student.email}</td>
                <td className="border px-4 py-2">{student.nickname}</td>
                <td className="border px-4 py-2">{formatDate(student.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const formatDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${date.toTimeString().substring(0, 8)}`;
};

export default StudentList;