import React from "react";
import { Footer } from "./sections/Footer";
import { NavbarLightDefault } from "./sections/NavbarLightDefault";
import { View } from "./sections/View";
import "../assets/css/postListPage.css";

export const PostListPage = () => {
  return (
    <div className="post-list" data-model-id="2823:13576">
      <NavbarLightDefault />
      <Footer />
      <View />
    </div>
  );
};

export default PostListPage;