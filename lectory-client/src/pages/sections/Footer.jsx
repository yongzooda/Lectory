import React from "react";
import { Logo } from "../../components/Logo";
import { SocialFacebook } from "../../assets/icons/SocialFacebook";
import { SocialTwitter } from "../../assets/icons/SocialTwitter";
import "../../assets/css/footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <Logo
        className="logo-instance"
        divClassName="logo-5"
        divClassNameOverride="logo-6"
        frameClassName="logo-2"
        overlapGroupClassName="logo-3"
        rectangleClassName="logo-4"
        text="MyCourse.io"
      />
      <p className="text-wrapper">
        Copyright © MyCourse.io 2024. All Rights Reserved
      </p>

      <div className="div">Web Programming</div>

      <div className="text-wrapper-2">Mobile Programming</div>

      <div className="text-wrapper-3">Java Beginner</div>

      <div className="text-wrapper-4">PHP Beginner</div>

      <div className="rectangle" />

      <div className="social-instagram" />

      <SocialFacebook className="social-facebook" />
      <SocialTwitter className="social-twitter" />
      <div className="text-wrapper-5">Adobe Illustrator</div>

      <div className="text-wrapper-6">Writing Course</div>

      <div className="text-wrapper-7">Adobe Photoshop</div>

      <div className="text-wrapper-8">Photography</div>

      <div className="text-wrapper-9">Design Logo</div>

      <div className="text-wrapper-10">Video Making</div>
    </footer>
  );
};

export default Footer;