import React from "react";

export const SocialFacebook = ({ className }) => {
  return (
    <svg
      className={`social-facebook ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M13.5 8.25V5.25C13.5 4.422 14.172 3.75 15 3.75H16.5V0H13.5C11.0145 0 9 2.0145 9 4.5V8.25H6V12H9V24H13.5V12H16.5L18 8.25H13.5Z"
        fill="#F9F9F9"
        fillOpacity="0.6"
      />
    </svg>
  );
};

export default SocialFacebook;