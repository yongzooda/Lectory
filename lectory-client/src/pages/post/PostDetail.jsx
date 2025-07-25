import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JwtUtils from "../../api/jwtUtils";
import PostComment from "./PostComment";
import "../../assets/css/postDetail.css";
import api from "../../api/axiosInstance";
import heart from "../../assets/images/heart.png";
import emptyHeart from "../../assets/images/emptyHeart.png";
import {getUser} from "../../api/userApi.js"
export const PostDetail = () => {
  const { postId } = useParams(); // URL 파라미터 가져오기
  const [post, setPost] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [decodedUserId, setDecodedUserId] = useState(null); // 게시글 작성자 본인인가
  const [likeCount, setLikeCount] = useState(0); // 초기값 0으로 수정
  const [liked, setLiked] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [allTags, setAllTags] = useState([]); // 전체 태그 목록 불러올 배열
  const [selectedTags, setSelectedTags] = useState([]); // 선택한 태그들
  const [editTitle, setEditTitle] = useState("");  // 제목 수정 저장용
  const [editContent, setEditContent] = useState(""); 


  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const res = await api.get("/tags"); // 서버에서 전체 태그 가져오기
        setAllTags(res.data); // 예: ["JavaScript", "Spring", "React", ...]
      } catch (error) {
        console.error("전체 태그 불러오기 실패", error);
      }
    };
    fetchAllTags();
  }, []);

  const [userInfo, setCurrentUserInfo] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false);
  // "접속 사용자 정보 조회"
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getUser();
        setCurrentUserInfo(user.userId);  // userId도 상태로 저장하는 거면 useState 필요!
        setIsAdmin(user?.userType === "ADMIN");
      } catch (err) {
        console.error("유저 정보를 불러오지 못했습니다.", err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (post) {
      setSelectedTags(post.tags || []); // 그냥 문자열 배열이니까 그대로 세팅
    }
  }, [post]);

  // 로그인 체크 및 리다이렉트
  useEffect(() => {
    if (!token) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
    } else {
      try {
        const id = JwtUtils.getId(token);
        setDecodedUserId(id);
      } catch (error) {
        console.error("토큰 디코딩 실패:", error);
      }
    }
  }, [token, navigate]);

  // 컴포넌트 첫 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (token) {
      fetchPostAndComments();
    }
  }, [postId, token]);


  const toggleTag = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleTagModalConfirm = async () => {
    console.log("userId" + post.userId);
    console.log("선택된 태그"+selectedTags);
    try {
      await api.put(`/posts/${postId}`, {
        userId: post.userId,
        title: editTitle,
        content: editContent,
        onlyExpert: post.onlyExpert,
        tagNames: selectedTags,  // 태그 배열: ["Java", "React"]
      });
      
      alert("수정 완료");
      setIsTagModalOpen(false);
      fetchPostAndComments();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "수정 중 오류 발생");
    }
  };
  // 게시글 + 댓글 데이터 fetch 함수
  const fetchPostAndComments = async () => {
    setLoading(true);
    try {
      // 1. 게시글 조회
      const postResponse = await api.get(`/posts/${postId}`);
      const postData = postResponse.data;

      // 2. 게시글 좋아요 정보 조회
      const postLikeResponse = await api.get(`/posts/${postId}/like`, {
        params: {
          target: 'POST',
          targetId: postId,
        },
      });
      const postLikeData = postLikeResponse.data;

      // 3. 댓글 조회
      const commentsResponse = await api.get(`/posts/${postId}/comment`);
      let commentsData = commentsResponse.data;

      // 4. 댓글별 좋아요 정보 조회
      const commentLikes = await Promise.all(
          commentsData.map((comment) =>
              api.get(`/posts/${postId}/like`, {
                params: {
                  target: 'COMMENT',
                  targetId: comment.commentId,
                },
              })
          )
      );

      // 5. 댓글 객체에 좋아요 정보 주입
      commentsData = commentsData.map((comment, idx) => ({
        ...comment,
        likeCount: commentLikes[idx].data.likeCount,
        liked: commentLikes[idx].data.liked,
      }));

      // 6. 댓글 정렬
      commentsData = commentsData.sort((a, b) => {
        if (a.isAccepted && !b.isAccepted) return -1;
        if (!a.isAccepted && b.isAccepted) return 1;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      // 7. 상태 업데이트
      setPost(postData);
      setComments(commentsData);
      setLikeCount(postLikeData.likeCount);
      setLiked(postLikeData.liked);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };


  // 수정 요청 함수 (PUT)
  const handleEdit = async () => {
    // 수정할 데이터 임시 입력 받기
    const newTitle = prompt("수정할 제목을 입력하세요", post.title);
    const newContent = prompt("수정할 내용을 입력하세요", post.content);
    setIsTagModalOpen(true);
    if (newTitle === null && newContent === null) {
      return;
    }
    
    if (newTitle.trim() === "" || newContent.trim() === "") {
      alert("제목과 내용을 모두 입력해야 합니다.");
      return;
    }
    setEditTitle(newTitle);
    setEditContent(newContent);
    setIsTagModalOpen(true);
  };

  // 삭제 요청 함수 (DELETE)
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      alert("삭제 완료");
      // 삭제 후 게시글 목록 페이지로 이동
      navigate("/posts");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "삭제 중 오류 발생");
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
      await api.post(`/posts/${postId}/comment`, {
        content: newComment, // 입력한 댓글 내용
      });

      alert("댓글이 등록되었습니다.");
      setNewComment(""); // 입력창 초기화
      fetchPostAndComments(); // 새 댓글 반영
    } catch (error) {
      if (error.response?.status === 403) {
        alert(error.response.data.message);
      } else {
        alert("댓글 작성에 실패했습니다.");
      }
      console.error(error);
    }
  };

  // 좋아요 요청 함수
  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${postId}/like`, {
        target: "POST",
        targetId: postId,
      });

      const { likeCount, liked } = response.data;
      setLikeCount(likeCount);
      setLiked(liked);
      const data = response.data;
      // 좋아요 개수 최신화
      setPost((prev) => ({
        ...prev,
        likeCount: data.likeCount,
      }));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "좋아요 처리에 실패했습니다.");
    }
  };

  // 신고
  const handleReport = async () => {
    const reportContent = window.prompt("신고 사유를 입력해주세요.");
    if (reportContent === null) {
      return;
    }

    if (reportContent.trim() === "") {
      alert("신고 사유가 필요합니다.");
      return;
    }
    try {
      await api.post(`/posts/${postId}/report`, {
        target: "POST",
        targetId: postId,
        content: reportContent,
      });

      alert("신고가 접수되었습니다.");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("이미 신고한 댓글입니다.");
      } else {
        alert(error.response?.data?.message || "신고에 실패했습니다.");
      }
      console.error("신고 요청 오류:", error);
    }
  };

// 채택 후 호출될 함수 수정
const handleUpdateAfterAccept = (postIsResolvedFromResponse) => {
  console.log("handleUpdateAfterAccept 호출, isResolved:", postIsResolvedFromResponse);
  setPost((prev) => ({
    ...prev,
    isResolved: postIsResolvedFromResponse,
  }));

  fetchPostAndComments();
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
              <div className="text-wrapper-22">
                {new Date(post.updatedAt).toLocaleString("ko-KR")}
              </div>
            </div>
  
            <div
              className="stats-wrapper-3"
              onClick={handleLike}
              style={{ cursor: "pointer" }}
            >
              <div className="stats">
                <div className="frame-8">
                  <img
                    className="free-icon-like"
                    alt="Free icon like"
                    src={liked ? heart : emptyHeart}
                  />
                  <div className="element">&nbsp;&nbsp;{likeCount}</div>
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
  
        {/* 작성자와 로그인한 userId 비교하여 버튼 노출 */}
        <div className="text-wrapper-26">
          {decodedUserId === post.userId || isAdmin ? (
            <>
              <button onClick={handleEdit}>수정</button> |{" "}
              <button onClick={handleDelete}>삭제</button>
            </>
          ) : (
            <button onClick={handleReport}>신고</button>
          )}
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
            {/* <div className="text-wrapper-19">댓글</div> */}
            {comments.length === 0 ? (
              <p>댓글이 없습니다.</p>
            ) : (
              comments.map((comment) => (
                <PostComment
                  key={comment.commentId}
                  postId={postId}
                  comment={comment}
                  decodedUserId={decodedUserId}
                  postOwnerId={post.userId}
                  isResolved={post.resolved}
                  onReply={handleReply}
                  onUpdate={handleUpdateAfterAccept}
                />
              ))
            )}
            {/* 입력 칸 */}
            <div className="div-2">
              <div className="frame">
                <button className="text-wrapper-11" onClick={handleAddComment}>
                  등록
                </button>
              </div>
        
              <textarea 
                  className="frame-2"
                  placeholder="댓글을 입력하세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
            </div>
          </div>
        </div>
      </div>

      {isTagModalOpen && (
            <div className="modal-backdrop">
              <div className="modal">
                <h2>태그 선택</h2>
                <div className="tag-list">
                  {allTags.map((tag) => (
                    <label key={tag}>
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
                <div className="modal-actions">
                  <button onClick={handleTagModalConfirm}>확인</button>
                  <button onClick={() => setIsTagModalOpen(false)}>취소</button>
                </div>
              </div>
            </div>
          )}
    </div>
  );
  
};

export default PostDetail;
