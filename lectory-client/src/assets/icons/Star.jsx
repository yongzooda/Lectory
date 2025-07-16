import React from "react";

export const Star = ({ className }) => {
  return (
    <svg
      className={`star ${className}`}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M7.99998 1.33331L10.06 5.50665L14.6666 6.17998L11.3333 9.42665L12.12 14.0133L7.99998 11.8466L3.87998 14.0133L4.66665 9.42665L1.33331 6.17998L5.93998 5.50665L7.99998 1.33331Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
};

export default Star;