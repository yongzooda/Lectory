import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { createPost } from "../api/postApi";
import { getCurrent } from "../api/userApi";
import { getAll as fetchTags } from "../api/tagApi";

export default function PostWritePage() {
  const navigate = useNavigate();

  const [subscriptionType, setSubscriptionType] = useState(null);
  const [tagOptions, setTagOptions] = useState([]);

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [expertAllowed, setExpertAllowed] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    // 사용자 구독 타입 조회
    async function loadUser() {
      try {
        const res = await getCurrent();
        setSubscriptionType(res.data.subscription);
      } catch (err) {
        console.error("사용자 정보 로딩 실패", err);
        setSubscriptionType("free");
      }
    }

    // 태그 목록 조회 (문자열 배열 또는 DTO 배열 대응)
    async function loadTagsData() {
      try {
        const res = await fetchTags();
        const data = res.data;
        let options = [];

        if (Array.isArray(data) && typeof data[0] === "string") {
          // 문자열 배열인 경우
          options = data.map((name) => ({ value: name, label: name }));
        } else if (Array.isArray(data.content)) {
          // Page<TagDto> 구조인 경우
          options = data.content.map((t) => ({ value: t.id, label: t.name }));
        } else if (Array.isArray(data)) {
          // TagDto[] 구조인 경우
          options = data.map((t) => ({ value: t.id, label: t.name }));
        } else {
          options = [];
        }

        setTagOptions(options);
      } catch (err) {
        console.error("태그 로딩 실패", err);
        setTagOptions([]);
      }
    }

    loadUser();
    loadTagsData();
  }, []);

  // 전문가 답변 허용 체크박스 핸들러
  const handleExpertChange = () => {
    if (subscriptionType !== "paid") {
      alert("유료(paid) 구독자만 전문가 답변 허용을 사용할 수 있습니다.");
      return;
    }
    setExpertAllowed((prev) => !prev);
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({
        title,
        content,
        onlyExpert: expertAllowed,
        tagIds: tags.map((t) => t.value),
      });
      navigate("/posts");
    } catch (err) {
      console.error("게시글 작성 오류", err);
      alert("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => navigate("/posts");

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6">게시글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
        <div>
          <label className="block text-lg mb-2">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        {/* 태그 선택 */}
        <div>
          <label className="block text-lg mb-2">태그 선택</label>
          <Select
            options={tagOptions}
            isMulti
            value={tags}
            onChange={setTags}
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
            onChange={handleExpertChange}
            disabled={subscriptionType !== "paid"}
            className="h-5 w-5"
          />
          <label htmlFor="expertAllowed" className="ml-3 text-base">
            전문가 답변 허용
          </label>
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-lg mb-2">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg p-3 h-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="게시글 내용을 입력하세요"
            required
          />
        </div>

        {/* 버튼 */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            작성 완료
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-400 transition"
          >
            취소하기
          </button>
        </div>
      </form>
    </div>
  );
}
