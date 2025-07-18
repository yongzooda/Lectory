import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../api/postApi";
import { getTags } from "../../api/tagApi"; // ✨ 백엔드에서 태그 가져오기
import { NavbarLightDefault } from "../sections/NavbarLightDefault";
import { Footer } from "../sections/Footer";
import "../../assets/css/page.css";

export const PostWritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]); // ✨ 전체 태그 목록
  const [selectedTags, setSelectedTags] = useState([]); // ✨ 선택된 태그
  const [allowExpert, setAllowExpert] = useState(false);
  const navigate = useNavigate();

  // ✨ 태그 불러오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagList = await getTags();
        console.log("불러온 태그:", tagList);
        setTags(tagList); // ["태그1", "태그2"] 형식이면 그대로 set
      } catch (error) {
        console.error("태그 불러오기 실패", error);
      }
    };

    fetchTags();
  }, []);

  // ✨ 태그 클릭 핸들링
  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ✨ 게시글 등록 요청
  const handleSubmit = async () => {
    try {
      const userId = 1; // 임시
      await createPost({
        userId,
        title,
        content,
        tags: selectedTags,
        allowExpert,
      });
      alert("게시글이 등록되었습니다.");
      navigate("/posts");
    } catch (err) {
      alert("게시글 등록 실패");
      console.error(err);
    }
  };

  return (
    <div className="page">
      <NavbarLightDefault />
      <div className="post-write-container">
        <input
          className="post-title-input"
          placeholder="게시글 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p className="tag-label">태그 선택</p>
        <div className="tag-container">
          {tags.length === 0 ? (
            <p>태그를 불러오는 중입니다...</p>
          ) : (
            tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`tag-btn ${
                  selectedTags.includes(tag) ? "active" : ""
                }`}
              >
                {tag}
              </button>
            ))
          )}
        </div>

        <hr className="divider" />

        <textarea
          className="post-content-area"
          placeholder="게시글 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={allowExpert}
              onChange={(e) => setAllowExpert(e.target.checked)}
            />
            전문가 답변 허용
          </label>
        </div>

        <div className="button-container">
          <button className="cancel-btn" onClick={() => navigate("/posts")}>
            취소하기
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            작성완료
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostWritePage;
