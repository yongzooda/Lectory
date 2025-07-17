// src/pages/sections/PostList.jsx
import React from "react";
import "../../assets/css/postList.css";

export const PostList = ({ posts }) => {
  // 1) 게시글이 없을 때 중앙 메시지
  if (!posts || posts.length === 0) {
    return (
      <div className="postList postList--centered">
        <p className="no-posts">등록된 게시글이 없습니다.</p>
      </div>
    );
  }

  // 2) 실제 posts 배열을 순회하며 렌더링
  return (
    <div className="postList">
      {posts.map((post, idx) => (
        <div key={post.id ?? idx} className={`div-${idx + 2}`}>
          <div className={idx % 2 === 0 ? "group" : `group-${idx}`}>
            <div className="frame">
              <div className="frame-2">
                {/* 제목 */}
                <div className="text-wrapper-11">{post.title}</div>

                {/* 상태: 해결완료/미해결 */}
                <div className={post.resolved ? "div-wrapper" : "frame-4"}>
                  <div
                    className={
                      post.resolved ? "text-wrapper-12" : "text-wrapper-15"
                    }
                  >
                    {post.resolved ? "해결완료" : "미해결"}
                  </div>
                </div>
              </div>

              <div className="frame-3">
                {/* 작성자/날짜 */}
                <div className="text-wrapper-13">{post.authorName}</div>
                <div className="text-wrapper-14">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                </div>
              </div>

              {/* 내용 미리보기 */}
              <p className="p">
                {post.content.length > 100
                  ? post.content.slice(0, 100) + "..."
                  : post.content}
              </p>
            </div>
          </div>

          {/* 구분선 */}
          <img
            className={idx === 0 ? "line" : idx === 2 ? "line-2" : "line-3"}
            alt="Line"
            src="https://c.animaapp.com/md2o9bct5LusW5/img/line-3.svg"
          />
        </div>
      ))}
    </div>
  );
};

export default PostList;
