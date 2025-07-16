import React from 'react';
import StudentList from '../components/StudentList';

const MembershipManagementPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Membership Management</h1>
      <StudentList />
    </div>
  );
};

export default MembershipManagementPage;
