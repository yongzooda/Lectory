import React from "react";
import { Star } from "../../assets/icons/Star";
import "../../assets/css/postDetail.css";

const PostComment = ({ comment, onReply }) => {
  return (
    <div>
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
    <div className="div-4">
      <div className="ellipse" />
      <div className="frame-3">
        <div className="frame-4">
          <div className="frame-5">
            <div className="text-wrapper-12">{comment.userNickname}</div>
            <div className="text-wrapper-13">·</div>
            <div className="text-wrapper-14">{comment.updatedAt}</div>
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

        <p className="p">{comment.content}</p>
      </div>
      

      {/* 대댓글 렌더링 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <div key={reply.commentId} className="div-5">
              <div className="img" />
              <div className="frame-6">
                <div className="frame-5">
                  <div className="text-wrapper-12">{reply.userNickname}</div>
                  <div className="text-wrapper-13">·</div>
                  <div className="text-wrapper-14">{reply.updatedAt}</div>
                </div>

                <p className="text-wrapper-15">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default PostComment;
