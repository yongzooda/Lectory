import React from "react";
import "../assets/css/outlineSmall.css";

export const OutlineSmall = ({
  className,
  hasTimelapse = true,
  divClassName,
  text = "Enabled",
}) => {
  return (
    <div className={`outline-small ${className}`}>
      <div className="text-2">
        {hasTimelapse && (
          <div className="timelapse-px">
            <img
              className="icon-image-timelapse-2"
              alt="Icon image timelapse"
              src="https://c.animaapp.com/md2o9bct5LusW5/img/icon-image-timelapse-24px.svg"
            />
          </div>
        )}

        <div className={`enabled-2 ${divClassName}`}>{text}</div>
      </div>
    </div>
  );
};

export default OutlineSmall;