import React, { useState } from 'react';
import PostList from './PostList';
import CommentList from './CommentList';

const ContentsManagementPage = () => {
  const [tab, setTab] = useState('POST'); // POST or COMMENT

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contents Management</h1>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${tab === 'POST' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('POST')}
        >
          게시글
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'COMMENT' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('COMMENT')}
        >
          댓글
        </button>
      </div>

      {tab === 'POST' ? <PostList /> : <CommentList />}
    </div>
  );
};

export default ContentsManagementPage;
