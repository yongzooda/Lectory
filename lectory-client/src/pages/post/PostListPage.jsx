import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../../api/postApi";

export default function PostListPage({ userRole, userId }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("title");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPosts({
          page,
          size: pageSize,
          sort: "createdAt,DESC",
        });
        const data = res.data;
        let list = Array.isArray(data.content) ? data.content : [];
        // expert 계정은 paid 구독자 게시글만
        if (userRole === "expert") {
          list = list.filter((p) => p.subscriber_type === "PAID" || p.isPaid);
        }
        setPosts(list);
        setTotalPages(data.totalPages ?? 1);
      } catch (e) {
        console.error(e);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [userRole, page]);

  // 검색 필터링 (로컬)
  const filtered = posts.filter((p) => {
    const term = searchTerm.toLowerCase();
    if (filterBy === "title") return p.title.toLowerCase().includes(term);
    if (filterBy === "tags")
      return (
        Array.isArray(p.tags) &&
        p.tags.some((t) => t.toLowerCase().includes(term))
      );
    if (filterBy === "myPosts") return p.userId === userId;
    return true;
  });

  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

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
      {/* 글쓰기 버튼 */}
      <div className="flex justify-end mb-4">
        <Link
          to={["expert", "admin"].includes(userRole) ? "#" : "/posts/write"}
          onClick={(e) => {
            if (["expert", "admin"].includes(userRole)) {
              e.preventDefault();
              alert("전문가 및 관리자 계정은 글쓰기 권한이 없습니다.");
            }
          }}
          className={`px-4 py-2 rounded text-white 
                ${
                  ["expert", "admin"].includes(userRole)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
        >
          글 쓰기
        </Link>
      </div>

      {/* 게시글 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">
          {searchTerm ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다."}
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((post) => (
            <li key={post.postId} className="p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <Link
                  to={`/posts/${post.postId}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {post.title}
                </Link>
                <span className="text-sm">
                  {post.isResolved ? "해결완료" : "미해결"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                작성자: {post.userNickname} |{" "}
                {new Date(post.createdAt).toLocaleDateString("ko-KR")}
              </p>
              <p className="text-gray-700 mb-2 truncate">
                {post.content.slice(0, 100)}...
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            이전
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page === totalPages - 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
