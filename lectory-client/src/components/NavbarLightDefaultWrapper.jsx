import React from "react";
import { Logo } from "./Logo";
import { OutlineSmall } from "./OutlineSmall";
import { PrimarySmall } from "./PrimarySmall";
import "../assets/css/navbarLightDefaultWrapper.css";

export const NavbarLightDefaultWrapper = ({
  className,
  logoText = "MyCourse.io",
  logoDivClassName,
  divClassName,
  divClassNameOverride,
  inputType = "text",
}) => {
  return (
    <div className={`navbar-light-default-wrapper ${className}`}>
      <Logo
        className="logo-7"
        divClassName="logo-11"
        divClassNameOverride={logoDivClassName}
        frameClassName="logo-8"
        overlapGroupClassName="logo-9"
        rectangleClassName="logo-10"
        text={logoText}
      />
      <div className={`text-wrapper-18 ${divClassName}`}>Become Instructor</div>

      <div className="search">
        <div className="overlap">
          <input
            className={`search-for-course ${divClassNameOverride}`}
            placeholder="Search for course"
            type={inputType}
          />

          <div className="search-px">
            <img
              className="icon-action-search"
              alt="Icon action search"
              src="https://c.animaapp.com/md2o9bct5LusW5/img/icon-action-search-24px.svg"
            />
          </div>
        </div>
      </div>

      <div className="shopping-cart">
        <img
          className="icon-action-shopping"
          alt="Icon action shopping"
          src="https://c.animaapp.com/md2o9bct5LusW5/img/icon-action-shopping-cart-24px.svg"
        />
      </div>

      <PrimarySmall className="primary-small-enabled" text="Sign Up" />
      <OutlineSmall
        className="outline-small-enabled"
        divClassName="outline-small-instance"
        hasTimelapse={false}
        text="Login"
      />
    </div>
  );
};

export default NavbarLightDefaultWrapper;