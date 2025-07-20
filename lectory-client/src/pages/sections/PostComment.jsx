import React, { useState } from "react";
import { Star } from "../../assets/icons/Star";
import "../../assets/css/postDetail.css";

const PostComment = ({ comment, onReply }) => {
  const [parentMenuVisible, setParentMenuVisible] = useState(false); 
  const [replyMenuVisible, setReplyMenuVisible] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editingReplyId, setEditingReplyId] = useState(null); // 현재 수정 중인 대댓글 ID
  const [editingReplyContent, setEditingReplyContent] = useState(""); // 대댓글 수정 내용

  const token = localStorage.getItem("accessToken");

  // 부모 댓글 메뉴 토글
  const toggleParentMenu = () => {
    setParentMenuVisible((prev) => !prev);
  };
  // 대댓글 메뉴 토글
  const toggleReplyMenu = (id) => {
    setReplyMenuVisible((prevId) => (prevId === id ? null : id));
  };
  // 댓글 수정 요청 (PUT)
  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comment/${comment.commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editContent }),
      });
      if (response.ok) {
        alert("댓글이 수정되었습니다.");
        setIsEditing(false);
        setParentMenuVisible(false);
        if (onUpdate) onUpdate(); 
      } else {
        alert("댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };
  // 댓글 삭제 요청 (DELETE)
  const handleDelete = async () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      const response = await fetch(`/api/posts/${postId}/comment/${comment.commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("댓글이 삭제되었습니다.");
        setParentMenuVisible(false);
        if (onUpdate) onUpdate(); 
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

   // 대댓글 수정 요청 (PUT)
  const handleReplyEdit = async (replyId) => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/comment/${replyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editingReplyContent }),
        }
      );

      if (response.ok) {
        alert("대댓글이 수정되었습니다.");
        setEditingReplyId(null);
        setReplyMenuVisible(null);
        if (onUpdate) onUpdate();
      } else {
        alert("대댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("대댓글 수정 오류:", error);
      alert("대댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 대댓글 삭제 요청 (DELETE)
  const handleReplyDelete = async (replyId) => {
    if (!window.confirm("대댓글을 삭제하시겠습니까?")) return;
    try {
      const response = await fetch(
        `/api/posts/${postId}/comment/${replyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("대댓글이 삭제되었습니다.");
        setReplyMenuVisible(null);
        if (onUpdate) onUpdate();
      } else {
        alert("대댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("대댓글 삭제 오류:", error);
      alert("대댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="comment">
      {/*좋아요 버튼*/}
      <div className="stats-wrapper-2">
        <div className="stats">
          <div className="frame-8">
            <img
              className="free-icon-like"
              alt="Free icon like"
              src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-like-6924834-1-4.png"
            />

            <div className="element">&nbsp;&nbsp;5</div>
          </div>
        </div>
      </div>
      {/* 댓글 내용 */}
      <div className="div-4">
        {/* 일반 사용자 프로필 사진 */}
        <div className="ellipse" />
        <div className="frame-3">
          <div className="frame-4">
            <div className="frame-5">
              <div className="text-wrapper-12">{comment.userNickname}</div>
              <div className="text-wrapper-13">·</div>
              <div className="text-wrapper-14">{comment.updatedAt}</div>
            </div>

            {/* 메뉴 버튼 */}
            <img
              className="free-icon-menu"
              alt="Free icon menu"
              src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-menu-3747742-1-2.png"
              onClick={toggleParentMenu}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* 수정 모드 */}
          {isEditing ? (
            <div className="edit-container">
              <textarea
                className="edit-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="edit-buttons">
                <button onClick={handleEdit}>저장</button>
                <button onClick={() => setIsEditing(false)}>취소</button>
              </div>
            </div>
          ) : (
            <p className="p">{comment.content}</p>
          )}

          {/* 메뉴 보이기 여부에 따라 렌더링 */}
          {parentMenuVisible && (
          <div className="menu">
            <div className="menu-section">
              <div
                  className="menu-item"
                  onClick={() => {
                    setIsEditing(true);
                    setParentMenuVisible(false);
                  }}
                >
                <div className="body">
                  <div className="description">수정</div>
                </div>
              </div>

              <div className="menu-item-2" onClick={handleDelete}>
                <div className="body">
                  <div className="description">삭제</div>
                </div>
              </div>

              <div className="menu-item-2" onClick={() => {
                    onReply(comment.commentId); // 답글 달기
                    setParentMenuVisible(false);
                  }}>
                <div className="body">
                  <div className="description">답글 달기</div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
        {/* 대댓글 렌더링 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map((reply) => (
              <div key={reply.commentId} className="div-5">
                <div className="ellipse" />
                <div className="frame-6">
                  <div className="frame-5">
                    <div className="text-wrapper-12">{reply.userNickname}</div>
                    <div className="text-wrapper-13">·</div>
                    <div className="text-wrapper-14">{reply.updatedAt}</div>
                  </div>

                  {/* 대댓글 수정 모드 */}
                  {editingReplyId === reply.commentId ? (
                    <div className="edit-container">
                      <textarea
                        className="edit-textarea"
                        value={editingReplyContent}
                        onChange={(e) =>
                          setEditingReplyContent(e.target.value)
                        }
                      />
                      <div className="edit-buttons">
                        <button onClick={() => handleReplyEdit(reply.commentId)}>
                          저장
                        </button>
                        <button onClick={() => setEditingReplyId(null)}>취소</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-wrapper-15">{reply.content}</p>
                  )}
                </div>
                {/* 대댓글 메뉴 */}
                <img
                  className="free-icon-menu"
                  alt="Free icon menu"
                  src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-menu-3747742-1-2.png"
                  onClick={() => toggleReplyMenu(reply.commentId)}
                  style={{ cursor: "pointer" }}
                />
                {replyMenuVisible === reply.commentId && (
                <div className="menu">
                 <div className="menu-section">
                    <div className="menu-item" onClick={() => {
                          setEditingReplyId(reply.commentId);
                          setEditingReplyContent(reply.content);
                          setReplyMenuVisible(null);
                        }}>
                      <div className="body">
                        <div className="description">수정</div>
                      </div>
                    </div>

                    <div className="menu-item-2" onClick={() => handleReplyDelete(reply.commentId)}>
                      <div className="body">
                        <div className="description">삭제</div>
                      </div>
                    </div>

                    <div className="menu-item-2" onClick={() => {
                          onReply(reply.commentId);
                          setReplyMenuVisible(null);
                        }}>
                      <div className="body">
                        <div className="description">답글 달기</div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  </div>
  );
};

export default PostComment;
