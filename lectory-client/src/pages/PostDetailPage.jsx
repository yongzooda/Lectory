import React from "react";
import { Footer } from "./sections/Footer";
import { NavbarLightDefault } from "./sections/NavbarLightDefault";
import { PostDetail } from "./sections/PostDetail";
import "../assets/css/page.css";

export const PostDetailPage = () => {
  return (
    <div className="page" data-model-id="2810:13554">
      <NavbarLightDefault />
      <Footer />
      <PostDetail />
    </div>
  );
};

export default PostDetailPage;
