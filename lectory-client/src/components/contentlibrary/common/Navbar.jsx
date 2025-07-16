import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar bg-white shadow mb-6">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold">
          Lectory
        </Link>
        <div className="space-x-4">
          <Link
            to="/library?memberId=1"
            className={`hover:text-blue-600 ${location.pathname.startsWith('/library') && !location.pathname.startsWith('/library/expert') ? 'text-blue-600' : 'text-gray-600'}`}
          >
            콘텐츠 라이브러리
          </Link>
          <Link
            to="/library/expert?expertId=3"
            className={`hover:text-blue-600 ${location.pathname.startsWith('/library/expert') ? 'text-blue-600' : 'text-gray-600'}`}
          >
            전문가용 라이브러리
          </Link>
          <Link
            to="/post-write"
            className={`hover:text-blue-600 ${location.pathname.startsWith('/post-write') ? 'text-blue-600' : 'text-gray-600'}`}
          >
            새 글 작성
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
