import React from "react";
import { Footer } from "./sections/Footer";
import { NavbarLightDefault } from "./sections/NavbarLightDefault";
import { PostWrite } from "./sections/PostWrite";
import "../assets/css/page.css";

export const PostWritePage = () => {
  return (
    <div className="page" data-model-id="2823:13581">  
      <NavbarLightDefault />
      <Footer />
      <PostWrite />
    </div>
  );
};

export default PostWritePage;