import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 text-white px-6 py-4 shadow">
      <div className="text-center text-2xl font-bold tracking-wider mb-2">
        ADMIN
      </div>
      <br />
      <div className="flex justify-center gap-16 text-sm font-semibold">
        <button onClick={() => navigate('/admin/expert-approval')} className="hover:text-yellow-400">
          Expert Approval
        </button>
        <button onClick={() => navigate('/admin/students')} className="hover:text-yellow-400">
          Membership Management
        </button>
        <button onClick={() => navigate('/admin/contents')} className="hover:text-yellow-400">
          Contents Management
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;
