import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostComment from "./PostComment";
import "../../assets/css/postDetail.css";

export const PostDetail = () => {

  const { postId } = useParams(); // URL 파라미터 가져오기
  const [post, setPost] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");


  // 로그인 체크 및 리다이렉트
  useEffect(() => {
    if (!token) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
    }
  }, [token, navigate]);

  // 컴포넌트 첫 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (token) {
      fetchPostAndComments();
    }
  }, [postId, token]);

  // 게시글 + 댓글 데이터 fetch 함수
  const fetchPostAndComments = async () => {
    setLoading(true);
    try {
      const postResponse = await fetch(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!postResponse.ok) {
        throw new Error("게시글을 불러오는 데 실패했습니다.");
      }
      const postData = await postResponse.json();

      const commentsResponse = await fetch(`/api/posts/${postId}/comment`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!commentsResponse.ok) {
        throw new Error("댓글을 불러오는 데 실패했습니다.");
      }
      const commentsData = await commentsResponse.json();

      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 수정 요청 함수 (PUT)
  const handleEdit = async () => {    
    // 수정할 데이터 임시 입력 받기
    const newTitle = prompt("수정할 제목을 입력하세요", post.title);
    const newContent = prompt("수정할 내용을 입력하세요", post.content);

    if (!newTitle || !newContent) {
      alert("제목과 내용을 모두 입력해야 합니다.");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: post.userId,
          title: newTitle,
          content: newContent,
          onlyExpert: post.onlyExpert,
          tagIds: post.tags ? Array.from(post.tags) : [],
        }),
      });

      if (!response.ok) {
        throw new Error("수정 실패");
      }
      alert("수정 완료");
      // 수정 후 상세 페이지 다시 불러오기
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("수정 중 오류 발생");
    }
  };

  // 삭제 요청 함수 (DELETE)
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("삭제 실패");
      }
      alert("삭제 완료");
      // 삭제 후 게시글 목록 페이지로 이동
      navigate("/posts");
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류 발생");
    }
  };

  const handleReply = (parentCommentId) => {
    console.log(`대댓글 달기 클릭: ${parentCommentId}`);
  };

  // 댓글 작성 요청
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment, // 입력한 댓글 내용
        }),
      });

      if (!response.ok) {
        throw new Error("댓글 작성 실패");
      }

      alert("댓글이 등록되었습니다.");
      setNewComment(""); // 입력창 초기화
      fetchPostAndComments(); // 새 댓글 반영
    } catch (error) {
      console.error(error);
      alert("댓글 등록 중 오류 발생");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="postDetail">
      {/* 게시글 */}
      <div className="overlap-2">
        <div className="div-7">
          <div className="text-wrapper-20">{post.title}</div>

          <div className="div-8">
            <div className="group-2">
              <div className="text-wrapper-21">{post.userNickname}</div>

              <div className="text-wrapper-22">{post.updatedAt}</div>
            </div>

            <div className="stats-wrapper-3">
              <div className="stats">
                <div className="frame-8">
                  <img
                    className="free-icon-like"
                    alt="Free icon like"
                    src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-like-6924834-1-4.png"
                  />

                  <div className="element">&nbsp;&nbsp;{post.likeCount}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="div-wrapper-2">
            <p className="text-wrapper-24">
              {post.content}
              <br />
            </p>
          </div>

          <div className="div-9">
            {post.tags &&
              Array.from(post.tags).map((tag, index) => (
                <div className="frame-9" key={index}>
                  <div className="text-wrapper-25">{tag}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="text-wrapper-26">
          <button onClick={handleEdit}>수정</button> |{" "}
          <button onClick={handleDelete}>삭제</button>
        </div>
      </div>

      {/* 구분선 */}
      <img
        className="line"
        alt="Line"
        src="https://c.animaapp.com/md2r5d9jD5c5WE/img/line-1.svg"
      />

      {/* 댓글 */}
      <div className="overlap">
        <div className="overlap-group">
          <div className="div-3">
            <div className="text-wrapper-19">댓글</div>
            {comments.length === 0 ? (
              <p>댓글이 없습니다.</p>
            ) : (
              comments.map((comment) => (
              <PostComment
                key={comment.commentId}
                postId={postId}
                comment={comment}
                onReply={handleReply}
              />
            ))
            )}
            </div>
        </div>       
      </div>
      
      {/* 입력 칸 */}
      <div className="div-2">
        <div className="frame">
          <button className="text-wrapper-11" onClick={handleAddComment}>등록</button>
        </div>

        <div className="frame-2">
          <textarea
          className="comment-textarea"
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)} // 입력값 상태 저장
        />
        </div>
      </div>      
    </div>
  );
};

export default PostDetail;