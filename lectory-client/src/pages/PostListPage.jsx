import React from "react";
import { Footer } from "./sections/Footer";
import { NavbarLightDefault } from "./sections/NavbarLightDefault";
import { PostList } from "./sections/PostList";
import "../assets/css/page.css";

export const PostListPage = () => {
  return (
    <div className="page" data-model-id="2823:13576">
      <NavbarLightDefault />
      <Footer />
      <PostList />
    </div>
  );
};

export default PostListPage;
