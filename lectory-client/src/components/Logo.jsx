import React from "react";
import "../assets/css/logo.css";

export const Logo = ({
  className,
  frameClassName,
  overlapGroupClassName,
  rectangleClassName,
  divClassName,
  divClassNameOverride,
  text = "MyCourse.io",
}) => {
  return (
    <div className={`logo ${className}`}>
      <div className={`overlap-group-wrapper ${frameClassName}`}>
        <div className={`overlap-group ${overlapGroupClassName}`}>
          <div className={`rectangle-3 ${rectangleClassName}`} />

          <div className={`text-wrapper-17 ${divClassName}`}>m</div>
        </div>
      </div>

      <div className={`mycourse-io ${divClassNameOverride}`}>{text}</div>
    </div>
  );
};

export default Logo;