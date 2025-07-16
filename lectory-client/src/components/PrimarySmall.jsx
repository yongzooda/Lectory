import React from "react";
import "../assets/css/primarySmall.css";

export const PrimarySmall = ({ className, text = "Enabled" }) => {
  return (
    <div className={`primary-small ${className}`}>
      <div className="text">
        <div className="timelapse">
          <img
            className="icon-image-timelapse"
            alt="Icon image timelapse"
            src="https://c.animaapp.com/md2o9bct5LusW5/img/icon-image-timelapse-24px.svg"
          />
        </div>

        <div className="enabled">{text}</div>
      </div>
    </div>
  );
};

export default PrimarySmall;