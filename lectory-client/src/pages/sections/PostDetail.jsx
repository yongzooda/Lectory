import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "../../assets/icons/Star";
import "../../assets/css/postDetail.css";

export const PostDetail = () => {

  const { postId } = useParams(); // URL 파라미터 가져오기
  const [post, setPost] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // 게시글 요청
        const postResponse = await fetch(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰 추가
          "Content-Type": "application/json",
        },
      });

        if (!postResponse.ok) {
          const text = await postResponse.text(); // 응답 내용을 text로 확인
          console.error("게시글 API 응답:", text);
          throw new Error("게시글을 불러오는 데 실패했습니다.");
        }
        const postData = await postResponse.json();

        // 댓글 요청
        const commentsResponse = await fetch(`/api/posts/${postId}/comment`, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰 추가
          "Content-Type": "application/json",
        },
      });
        if (!commentsResponse.ok) {
          const text = await commentsResponse.text();
          console.error("댓글 API 응답:", text);
          throw new Error("댓글을 불러오는 데 실패했습니다.");
        }
        const commentsData = await commentsResponse.json();

        // 상태에 데이터 저장
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

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
      const response = await fetch(`/api/posts/${postId}?userId=${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "수정 실패");
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
      const response = await fetch(`/api/posts/${postId}?userId=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "삭제 실패");
      }
      alert("삭제 완료");
      // 삭제 후 게시글 목록 페이지로 이동
      navigate("/posts");
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류 발생");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="postDetail">
      <div className="div-2">
        <div className="frame">
          <div className="text-wrapper-11">등록</div>
        </div>

        <div className="frame-2" />
      </div>

      <div className="overlap">
        <div className="overlap-group">
          <div className="div-3">
            <div className="div-4">
              <div className="ellipse" />

              <div className="frame-3">
                <div className="frame-4">
                  <div className="frame-5">
                    <div className="text-wrapper-12">사용자 댓글</div>

                    <div className="text-wrapper-13">·</div>

                    <div className="text-wrapper-14">댓글 수정 일자</div>
                  </div>

                  <div className="button">
                    <Star className="star-instance" />
                    <button className="button-2">채택하기</button>
                  </div>
                </div>

                <p className="p">
                  Some of the most delicious tacos I’ve ever had! The whole
                  family loved them
                </p>
              </div>

              <img
                className="free-icon-menu"
                alt="Free icon menu"
                src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-menu-3747742-1-2.png"
              />
            </div>

            <div className="div-5">
              <img
                className="img"
                alt="Ellipse"
                src="https://c.animaapp.com/md2r5d9jD5c5WE/img/ellipse-1.png"
              />

              <div className="frame-6">
                <div className="frame-5">
                  <div className="text-wrapper-12">대댓글</div>

                  <div className="text-wrapper-13">·</div>

                  <div className="text-wrapper-14">댓글 수정 일자</div>
                </div>

                <p className="text-wrapper-15">
                  Works really well with shrimp and fish 🐟
                </p>
              </div>

              <img
                className="free-icon-menu"
                alt="Free icon menu"
                src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-menu-3747742-1-2.png"
              />
            </div>

            <div className="div-6">
              <img
                className="img"
                alt="Ellipse"
                src="https://c.animaapp.com/md2r5d9jD5c5WE/img/ellipse-1-1.png"
              />

              <div className="frame-3">
                <div className="frame-7">
                  <div className="group">
                    <div className="text-wrapper-16">채택된 전문가 댓글</div>

                    <div className="text-wrapper-17">·</div>

                    <div className="text-wrapper-18">댓글 수정 일자</div>

                    <img
                      className="star-2"
                      alt="Star"
                      src="https://c.animaapp.com/md2r5d9jD5c5WE/img/star-1.svg"
                    />
                  </div>

                  <div className="button-3">
                    <Star className="star-instance" />
                    <button className="button-4">채택댓글</button>
                  </div>
                </div>

                <p className="p">
                  Some of the most delicious tacos I’ve ever had! The whole
                  family loved them
                </p>
              </div>

              <img
                className="free-icon-menu"
                alt="Free icon menu"
                src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-menu-3747742-1-2.png"
              />
            </div>

            <div className="menu">
              <div className="menu-section">
                <div className="menu-item">
                  <div className="body">
                    <div className="description">수정</div>
                  </div>
                </div>

                <div className="menu-item-2">
                  <div className="body">
                    <div className="description">삭제</div>
                  </div>
                </div>

                <div className="menu-item-2">
                  <div className="body">
                    <div className="description">답글 달기</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-wrapper-19">댓글</div>
          </div>

          <div className="stats-wrapper">
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
        </div>

        <div className="overlap-group-wrapper">
          <div className="overlap-group-2">
            <div className="frame-wrapper">
              <div className="frame-8">
                <img
                  className="free-icon-like"
                  alt="Free icon like"
                  src="https://c.animaapp.com/md2r5d9jD5c5WE/img/free-icon-like-6924834-1-4.png"
                />

                <div className="element">&nbsp;&nbsp;5</div>
              </div>
            </div>

            <div className="div-wrapper">
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
          </div>
        </div>

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
      </div>

      <img
        className="line"
        alt="Line"
        src="https://c.animaapp.com/md2r5d9jD5c5WE/img/line-1.svg"
      />

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

          <div className="text-wrapper-23">
            <button onClick={handleEdit}>수정</button> |{" "}
            <button onClick={handleDelete}>삭제</button>
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

        <div className="text-wrapper-26">수정 | 삭제</div>
      </div>
    </div>
  );
};

export default PostDetail;