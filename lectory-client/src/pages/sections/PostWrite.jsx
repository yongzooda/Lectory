import React from "react";
import "../../assets/css/postWrite.css";

export const PostWrite = () => {
  return (
    <div className="postWrite">
      <div className="frame">
        <div className="tab-wrapper">
          <div className="tab">
            <div className="text-wrapper">작성완료</div>
          </div>
        </div>

        <div className="div-wrapper">
          <div className="div">
            <div className="text-wrapper-2">취소하기</div>
          </div>
        </div>
      </div>

      <div className="div-2">
        <div className="text-wrapper-3">게시글 제목을 입력하세요</div>

        <div className="div-3">
          <div className="frame-2">
            <div className="text-wrapper-4">태그1</div>
          </div>

          <div className="frame-2">
            <div className="text-wrapper-4">태그2</div>
          </div>

          <div className="frame-2">
            <div className="text-wrapper-4">태그3</div>
          </div>
        </div>

        <img
          className="line"
          alt="Line"
          src="https://c.animaapp.com/md2q2dqjYNnCLi/img/line-1.svg"
        />

        <div className="div-wrapper-2">
          <p className="p">
            게시글 내용 블라블라
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostWrite;