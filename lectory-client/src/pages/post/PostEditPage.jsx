import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPostById, updatePost } from "../api/postApi";
import PostEdit from "./sections/PostEdit";

export default function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetchPostById(postId);
        const data = res.data;
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags || []);
      } catch (err) {
        console.error(err);
        setError("게시글 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagIds = tags.map((tag) => tag.tagId || tag.id || tag);
      await updatePost(postId, { title, content, tagIds });
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error(err);
      setError("게시글 수정에 실패했습니다.");
    }
  };

  if (isLoading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <PostEdit
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      tags={tags}
      setTags={setTags}
      onSubmit={handleSubmit}
    />
  );
}
