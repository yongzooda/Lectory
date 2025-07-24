import React from 'react';
import StudentList from './UserManagementList';
import AdminNavigation from './AdminNavigation';

const MembershipManagementPage = () => {
  return (
    <div className="p-8">
      <AdminNavigation />
      <br />
      <h1 className="text-2xl font-bold mb-6">Membership Management</h1>
      <StudentList />
    </div>
  );
};

export default MembershipManagementPage;
