import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/postList.css";

export const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <p className="no-posts">등록된 게시글이 없습니다.</p>;
  }

  return (
    <div className="postList">
      {posts.map((post, idx) => (
        <div key={post.id} className={`div-${idx + 2}`}>
          <div className={idx % 2 === 0 ? "group" : `group-${idx}`}>
            <div className="frame">
              <div className="frame-2">
                <Link to={`/posts/${post.id}`} className="text-wrapper-11">
                  {post.title}
                </Link>

                {/* 상태 */}
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
                <div className="text-wrapper-13">{post.authorName}</div>
                <div className="text-wrapper-14">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                </div>
              </div>

              <p className="p">
                {post.content.length > 100
                  ? post.content.slice(0, 100) + "..."
                  : post.content}
              </p>
            </div>
          </div>

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
