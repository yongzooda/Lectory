import React, { useEffect, useState } from "react";
import { Footer } from "../sections/Footer";
import { NavbarLightDefault } from "../sections/NavbarLightDefault";
import { PostDetail } from "./PostDetail";
import "../../assets/css/page.css";
import api from "../../api/axiosInstance";
import JwtUtils from "../../api/jwtUtils";
import AdminNavigation from "../admin/AdminNavigation"; // 관리자 네비게이션

export const PostDetailPage = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const role = JwtUtils.getRole(token);
        setUserRole(role);
      } else {
        console.warn("JWT 토큰이 없습니다.");
      }
    } catch (error) {
      console.error("JWT에서 역할을 파싱하는 도중 에러 발생:", error);
    }
  }, []); // 컴포넌트 마운트 시 한 번 실행

  return (
    <div className="page" data-model-id="2810:13554">
      <div className="p-1">
        {userRole === "ADMIN" ? <AdminNavigation /> : null}
      </div>
      <PostDetail />
    </div>
  );
};

export default PostDetailPage;
