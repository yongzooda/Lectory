import React, { useState } from "react";
import { Star } from "../../assets/icons/Star";
import "../../assets/css/postDetail.css";
import api from "../../api/axiosInstance";

const PostComment = ({
  postId,
  comment,
  decodedUserId,
  postOwnerId,
  isResolved,
  onReply,
  onUpdate,
}) => {
  const [parentMenuVisible, setParentMenuVisible] = useState(false); // 부모 댓글 메뉴 토글
  const [replyMenuVisible, setReplyMenuVisible] = useState(null); // 대댓글 메뉴 토글
  const [isEditing, setIsEditing] = useState(false); // 댓글 수정
  const [editContent, setEditContent] = useState(comment.content);
  const [editingReplyId, setEditingReplyId] = useState(null); // 현재 수정 중인 대댓글 ID
  const [editingReplyContent, setEditingReplyContent] = useState(""); // 대댓글 수정 내용
  const [replyingToId, setReplyingToId] = useState(null); // 대댓글 입력 중인 댓글 ID
  const [replyContent, setReplyContent] = useState(""); // 대댓글 내용

  const [likeCount, setLikeCount] = useState(comment.likeCount); // 댓글 좋아요
  const [liked, setLiked] = useState(comment.liked || false);

  const initialReplyLikes = {}; // 대댓글 좋아요
  (comment.replies || []).forEach((r) => {
    initialReplyLikes[r.commentId] = {
      likeCount: r.likeCount,
      liked: r.liked || false,
    };
  });
  const [replyLikes, setReplyLikes] = useState(initialReplyLikes);

  const token = localStorage.getItem("accessToken");
  // "유료 사용자만 볼 수 있습니다." 내용인지 체크
  const isHiddenContent = comment.content === "유료 사용자만 볼 수 있습니다.";

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
      await api.put(`/posts/${postId}/comment/${comment.commentId}`, {
        content: editContent,
      });
      alert("댓글이 수정되었습니다.");
      setIsEditing(false);
      setParentMenuVisible(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      alert(
        error.response?.data?.message || "댓글 수정 중 오류가 발생했습니다."
      );
    }
  };
  // 댓글 삭제 요청 (DELETE)
  const handleDelete = async () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/posts/${postId}/comment/${comment.commentId}`);
      alert("댓글이 삭제되었습니다.");
      setParentMenuVisible(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      alert(
        error.response?.data?.message || "댓글 삭제 중 오류가 발생했습니다."
      );
    }
  };

  // 대댓글 수정 요청 (PUT)
  const handleReplyEdit = async (replyId) => {
    try {
      await api.put(`/posts/${postId}/comment/${replyId}`, {
        content: editingReplyContent,
      });

      alert("대댓글이 수정되었습니다.");
      setEditingReplyId(null);
      setReplyMenuVisible(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("대댓글 수정 오류:", error);
      alert(
        error.response?.data?.message || "대댓글 수정 중 오류가 발생했습니다."
      );
    }
  };

  // 대댓글 삭제 요청 (DELETE)
  const handleReplyDelete = async (replyId) => {
    if (!window.confirm("대댓글을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/posts/${postId}/comment/${replyId}`);

      alert("대댓글이 삭제되었습니다.");
      setReplyMenuVisible(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("대댓글 삭제 오류:", error);
      alert(
        error.response?.data?.message || "대댓글 삭제 중 오류가 발생했습니다."
      );
    }
  };

  // 신고
  const handleReport = async (commentId) => {
    const reportContent = window.prompt("신고 사유를 입력해주세요.");
    if (reportContent === null) {
      return;
    }

    if (reportContent.trim() === "") {
      alert("신고 사유가 필요합니다.");
      return;
    }
    try {
      await api.post(`/posts/${postId}/comment/${commentId}/report`, {
        target: "COMMENT",
        targetId: commentId,
        content: reportContent,
      });

      alert("신고가 접수되었습니다.");
      setParentMenuVisible(false);
      setReplyMenuVisible(null);
    } catch (error) {
      if (error.response?.status === 409) {
        alert("이미 신고한 댓글입니다.");
      } else {
        alert(error.response?.data?.message || "신고에 실패했습니다.");
      }
      console.error("신고 요청 오류:", error);
    }
  };

  // 대댓글 입력창 열기/닫기
  const handleReplyToggle = (commentId) => {
    setReplyingToId(commentId);
    setReplyContent("");
  };

  // 대댓글 작성 POST 요청
  const handleReplySubmit = async (parentCommentId) => {
    if (!replyContent.trim()) {
      alert("답글 내용을 입력하세요.");
      return;
    }

    try {
      await api.post(`/posts/${postId}/comment/${parentCommentId}`, {
        content: replyContent,
      });

      alert("대댓글이 등록되었습니다.");
      setReplyContent("");
      setReplyingToId(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("대댓글 등록 오류:", error);
      alert(
        error.response?.data?.message || "대댓글 등록 중 오류가 발생했습니다."
      );
    }
  };

  // 댓글 채택 요청
  const handleAccept = async (commentId) => {
    if (!window.confirm("이 댓글을 채택하시겠습니까?")) return;

    try {
      const response = await api.post(
        `/posts/${postId}/comment/${commentId}/accept`
      );
      alert("댓글이 채택되었습니다.");
      if (onUpdate) onUpdate(response.data.postIsResolved);
    } catch (error) {
      console.error("채택 요청 오류:", error);
      alert(
        error.response?.data?.message || "댓글 채택 중 오류가 발생했습니다."
      );
    }
  };

  // 댓글 좋아요 요청
  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(`/posts/${postId}/comment/${commentId}/like`, {
        target: "COMMENT",
        targetId: commentId,
      });

      const { likeCount, liked } = response.data;

      setLikeCount(likeCount);
      setLiked(liked);
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
      alert(
        error.response?.data?.message || "댓글 좋아요 처리 중 오류가 발생했습니다."
      );
    }
  };

  // 대댓글 좋아요 요청
  const handleLikeReply = async (replyId) => {
    try {
      const response = await api.post(`/posts/${postId}/comment/${replyId}/like`, {
        target: "COMMENT",
        targetId: replyId,
      });

      const { likeCount, liked } = response.data;

      setReplyLikes((prev) => ({
        ...prev,
        [replyId]: { likeCount, liked },
      }));
    } catch (error) {
      console.error("대댓글 좋아요 오류:", error);
      alert(
        error.response?.data?.message || "대댓글 좋아요 처리 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="comment">
      {/* 댓글 내용 */}
      <div className="div-4">
        {/* 좋아요 버튼은 숨김 처리 */}
        {!isHiddenContent && (
          <div className="stats-wrapper-2">
            <div className="stats">
              <div className="frame-8">
                <img
                  className="free-icon-like"
                  alt="Free icon like"
                  src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-like-6924834-1-4.png"
                  onClick={() => handleLikeComment(comment.commentId)}
                  style={{ cursor: "pointer" }}
                />

                <div className="element">{likeCount}</div>
              </div>
            </div>
          </div>
        )}
        <div className="right-group">
          {/* 일반 사용자 프로필 사진 */}
          <div className="ellipse" />
          <div className="frame-3">
            <div className="frame-4">
              <div className="frame-5">
                <div className="text-wrapper-12">{comment.userNickname}</div>
                <div className="text-wrapper-13">·</div>
                <div className="text-wrapper-14">
                  {new Date(comment.updatedAt).toLocaleString("ko-KR")}
                </div>
              </div>

              {/* 채택됨 표시 */}
              {comment.isAccepted && (
                <div className="button-3">
                  <Star className="star-instance" />
                  <button className="button-4">채택댓글</button>
                </div>
              )}
              {/* 채택 버튼: 게시글 작성자 && 미해결 상태일 때만 노출 */}
              {!isResolved &&
                decodedUserId === postOwnerId &&
                !comment.isAccepted && (
                  <div className="button">
                    <Star className="star-instance" />
                    <button
                      className="button-2"
                      onClick={() => handleAccept(comment.commentId)}
                    >
                      채택하기
                    </button>
                  </div>
                )}

              {/* 메뉴 버튼 */}
              {!isHiddenContent && (
                <img
                  className="free-icon-menu"
                  alt="Free icon menu"
                  src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-menu-3747742-1-2.png"
                  onClick={toggleParentMenu}
                  style={{ cursor: "pointer" }}
                />
              )}
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
                  <button onClick={handleEdit}>저장</button> |{" "}
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
                  {decodedUserId === comment.userId ? (
                    <>
                      {/* 내가 작성자일 때만 수정/삭제 버튼 */}
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
                    </>
                  ) : (
                    <>
                      {/* 내가 작성자가 아닐 때 신고 버튼만 */}
                      <div
                        className="menu-item-2"
                        onClick={() => handleReport(comment.commentId)}
                      >
                        <div className="body">
                          <div className="description">신고</div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 답글 달기 버튼은 작성자 여부 관계없이 모두 노출 */}
                  <div
                    className="menu-item-2"
                    onClick={() => {
                      handleReplyToggle(comment.commentId); // 답글 달기
                      setParentMenuVisible(false);
                    }}
                  >
                    <div className="body">
                      <div className="description">답글 달기</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 답글 입력창 */}
            {replyingToId === comment.commentId && (
              <div
                className="reply-input-container"
                style={{ marginTop: "8px" }}
              >
                <textarea
                  className="reply-textarea"
                  placeholder="답글을 입력하세요..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                />
                <div style={{ marginTop: "4px" }}>
                  <button onClick={() => handleReplySubmit(comment.commentId)}>
                    등록
                  </button>{" "}
                  | <button onClick={() => setReplyingToId(null)}>취소</button>
                </div>
              </div>
            )}
          </div>
          {/* 대댓글 렌더링 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="replies">
              {comment.replies.map((reply) => (
                <div key={reply.commentId} className="div-5">
                  {/*좋아요 버튼*/}
                  <div className="stats-wrapper-2">
                    <div className="stats">
                      <div className="frame-8">
                        <img
                          className="free-icon-like"
                          alt="Free icon like"
                          src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-like-6924834-1-4.png"
                          onClick={() => handleLikeReply(reply.commentId)}
                          style={{ cursor: "pointer" }}
                        />

                        <div className="element">{replyLikes[reply.commentId]?.likeCount || 0}</div>
                      </div>
                    </div>
                  </div>
                  <div className="right-group">
                    <div className="ellipse" />
                    <div className="frame-6">
                      <div className="frame-5">
                        <div className="text-wrapper-12">
                          {reply.userNickname}
                        </div>
                        <div className="text-wrapper-13">·</div>
                        <div className="text-wrapper-14">
                          {new Date(reply.updatedAt).toLocaleString("ko-KR")}
                        </div>
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
                            <button
                              onClick={() => handleReplyEdit(reply.commentId)}
                            >
                              저장
                            </button>{" "}
                            |{" "}
                            <button onClick={() => setEditingReplyId(null)}>
                              취소
                            </button>
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
                      <div className="menu-1">
                        <div className="menu-section">
                          {decodedUserId === reply.userId ? (
                            <>
                              {/* 댓글 작성자 == 로그인 사용자일 때 수정/삭제 */}
                              <div
                                className="menu-item"
                                onClick={() => {
                                  setEditingReplyId(reply.commentId);
                                  setEditingReplyContent(reply.content);
                                  setReplyMenuVisible(null);
                                }}
                              >
                                <div className="body">
                                  <div className="description">수정</div>
                                </div>
                              </div>

                              <div
                                className="menu-item-2"
                                onClick={() =>
                                  handleReplyDelete(reply.commentId)
                                }
                              >
                                <div className="body">
                                  <div className="description">삭제</div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* 댓글 작성자 != 로그인 사용자일 때 신고 */}
                              <div
                                className="menu-item-2"
                                onClick={() => handleReport(reply.commentId)}
                              >
                                <div className="body">
                                  <div className="description">신고</div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostComment;
