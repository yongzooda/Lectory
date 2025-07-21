import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import { createPost } from "../../api/postApi";
import { fetchTags } from "../../api/tagApi";
import {getUser} from "../../api/userApi.js"

export default function PostWritePage() {
  const navigate = useNavigate();

  const [subscriptionType, setSubscriptionType] = useState("free");
  const [tagOptions, setTagOptions] = useState([]);

  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [expertAllowed, setExpertAllowed] = useState(false);
  const [content, setContent] = useState("");

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole")?.toLowerCase();

  useEffect(() => {
    setSubscriptionType(userRole === "paid" ? "paid" : "free");

    // 태그 불러오기
    fetchTags()
      .then((arr) => {
        console.log("▶︎ /api/tags 응답:", arr);
        const opts = arr.map((name) => ({ value: name, label: name }));
        setTagOptions(opts);
      })
      .catch((err) => {
        console.error("태그 로딩 실패", err);
        setTagOptions([]);
      });
  }, []);

  const [userInfo, setCurrentUserInfo] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);

  // "접속 사용자 정보"
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getUser();
        setCurrentUserInfo(user);  // userId만 저장하지 말고 user 전체를 저장
        setIsAdmin(user?.userType === "ADMIN");
      } catch (err) {
        console.error("유저 정보를 불러오지 못했습니다.", err);
      }
    }
    fetchUser();
  }, []);



  const handleExpertToggle = () => {
    if (subscriptionType !== "paid") {
      alert("유료(paid) 구독자만 전문가 답변 허용 기능을 사용할 수 있습니다.");
      return;
    }
    setExpertAllowed((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      alert("로그인 후 작성 가능합니다.");
      return null;
    }

    try {
      await createPost({
        title,
        content,
        onlyExpert: expertAllowed,
        tagIds: selectedTags.map((t) => t.value),
        userId: userId,
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

        {/* 버튼 */}
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
