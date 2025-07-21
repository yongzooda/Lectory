// src/pages/PostWritePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import { createPost } from "../../api/postApi";
import { fetchTags } from "../../api/tagApi";
import { getUser } from "../../api/userApi.js";

export default function PostWritePage() {
  const navigate = useNavigate();

  // — 로그인한 사용자 정보 (userId, userType)을 getUser()로만 관리
  const [userInfo, setUserInfo] = useState(null);
  const [subscriptionType, setSubscriptionType] = useState("free"); // free | paid

  // — 폼 상태
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [expertAllowed, setExpertAllowed] = useState(false);
  const [content, setContent] = useState("");
  const [tagOptions, setTagOptions] = useState([]);

  // 1) 마운트 시점에 로그인 체크 & 사용자 정보 로드
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getUser(); // { userId, userType, … }
        setUserInfo(user);
        setSubscriptionType(
          user.userType?.toLowerCase() === "paid" ? "paid" : "free"
        );
      } catch (err) {
        console.error("유저 정보를 불러오지 못했습니다.", err);
        alert("로그인 후 작성 가능합니다.");
        navigate("/login", { replace: true });
      }
    }
    loadUser();
  }, [navigate]);

  // 2) 태그 목록 로드
  useEffect(() => {
    fetchTags()
      .then((arr) => {
        const opts = arr.map((name) => ({ value: name, label: name }));
        setTagOptions(opts);
      })
      .catch((err) => {
        console.error("태그 로딩 실패", err);
        setTagOptions([]);
      });
  }, []);

  // 전문가 답변 허용 토글
  const handleExpertToggle = () => {
    if (subscriptionType !== "paid") {
      alert("유료(paid) 구독자만 전문가 답변 허용 기능을 사용할 수 있습니다.");
      return;
    }
    setExpertAllowed((prev) => !prev);
  };

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      alert("로그인 후 작성 가능합니다.");
      return;
    }

    try {
      await createPost({
        title,
        content,
        onlyExpert: expertAllowed,
        tagNames: selectedTags.map((t) => t.value),
        userId: userInfo.userId, // 서버에서 받아온 userId
      });
      navigate("/posts");
    } catch (err) {
      console.error("글쓰기 오류", err);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-semibold mb-6">게시글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
        <div>
          <label className="block mb-2 font-medium">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
            className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 태그 선택 */}
        <div>
          <label className="block mb-2 font-medium">태그 선택</label>
          <Select
            options={tagOptions}
            isMulti
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="태그를 선택하세요"
            noOptionsMessage={() => "태그가 없습니다"}
          />
        </div>

        {/* 전문가 답변 허용 */}
        <div className="flex items-center">
          <input
            id="expertAllowed"
            type="checkbox"
            checked={expertAllowed}
            onChange={handleExpertToggle}
            disabled={subscriptionType !== "paid"}
            className="h-5 w-5"
          />
          <label htmlFor="expertAllowed" className="ml-3">
            전문가 답변 허용
          </label>
        </div>

        {/* 내용 */}
        <div>
          <label className="block mb-2 font-medium">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="게시글 내용을 입력하세요"
            required
            className="w-full border rounded p-3 h-40 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            작성 완료
          </button>
          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="px-6 py-3 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소하기
          </button>
        </div>
      </form>
    </div>
  );
}
