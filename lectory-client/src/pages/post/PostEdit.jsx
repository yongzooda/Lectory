import React from "react";

export default function PostEdit({
  title,
  setTitle,
  content,
  setContent,
  tags,
  setTags,
  onSubmit,
}) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="태그 (쉼표로 구분)"
          value={tags.map((tag) => tag.name || tag).join(", ")}
          onChange={(e) =>
            setTags(
              e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t !== "")
            )
          }
          className="w-full p-2 border rounded"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
}
