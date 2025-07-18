import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function PostListPage({ userRole, userId }) {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("title");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get("/api/posts", { withCredentials: true });
        console.log("raw posts response: ", res.data);

        const raw = res.data;
        let data = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.content)
          ? raw.content
          : [];

        if (userRole === "expert") {
          data = data.filter((p) => p.subscriber_type === "PAID" || p.isPaid);
        }

        setPosts(data);
      } catch (e) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [userRole]);

  // 검색 필터링
  const filtered = posts.filter((p) => {
    const term = searchTerm.toLowerCase();
    if (filterBy === "title") {
      return p.title.toLowerCase().includes(term);
    }
    if (filterBy === "tags") {
      return (
        Array.isArray(p.tags) &&
        p.tags.some((t) => t.toLowerCase().includes(term))
      );
    }
    if (filterBy === "myPosts") {
      return p.userId === userId;
    }
    return true;
  });

  if (loading) return <p className="p-4">로딩 중...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* 검색창 */}
      <div className="flex items-center mb-4 space-x-2">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="title">제목</option>
          <option value="tags">태그</option>
          <option value="myPosts">내 글</option>
        </select>
      </div>

      {/* 글쓰기 버튼: FREE/PAID 사용자만 */}
      <div className="flex justify-end mb-4">
        {["free", "paid"].includes(userRole) && (
          <Link
            to="/posts/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            글 쓰기
          </Link>
        )}
      </div>

      {/* 게시글 목록 */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((post) => (
            <li
              key={post.postId}
              className={`p-4 border rounded ${
                post.subscriber_type === "PAID" || post.isPaid
                  ? "bg-yellow-50"
                  : ""
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <Link
                  to={`/posts/${post.postId}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {post.title}
                </Link>
                <span className="text-sm">
                  {post.isResolved || post.is_resolved ? "해결완료" : "미해결"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                작성자: {post.userNickname} |{" "}
                {new Date(post.createdAt || post.created_at).toLocaleDateString(
                  "ko-KR"
                )}
              </p>
              <p className="text-gray-700 mb-2 truncate">
                {(post.content || post.body || "").slice(0, 100)}...
              </p>
              {(post.subscriber_type === "PAID" || post.isPaid) && (
                <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded">
                  Paid 글
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
