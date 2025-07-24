// lectory-client/src/components/detail/CommentSection.jsx
import styles from '../../assets/css/contentLibrary.module.css';
import React, { useState } from 'react';

/**
 * 강의실 상세 페이지 – 수강평(댓글) 섹션
 *
 * props
 *  • comments : Array<CommentDto>
 *      └─ {
 *            commentId : Long
 *            author    : String
 *            content   : String
 *            createdAt : String (ISO)
 *         }
 *  • onAdd(content) : (선택) 새 댓글 작성 콜백
 */
const CommentSection = ({ comments = [], onAdd }) => {
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onAdd || !input.trim()) return;

    try {
      setSubmitting(true);
      await onAdd(input.trim());
      setInput('');
    } catch (err) {
      console.error(err);
      alert('댓글 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* ─── 댓글 리스트 ─── */}
      {comments.length === 0 ? (
        <p className="text-center text-gray-500">등록된 수강평이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.commentId} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{c.author}</span>
                <span className="text-sm text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-line">{c.content}</p>
            </li>
          ))}
        </ul>
      )}

      {/* ─── 댓글 작성 ─── */}
      {onAdd && (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="수강 후기를 작성해 보세요"
            rows={3}
            className="border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !input.trim()}
            className="self-end bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {submitting ? '등록 중…' : '댓글 등록'}
          </button>
        </form>
      )}
    </section>
  );
};

export default CommentSection;
