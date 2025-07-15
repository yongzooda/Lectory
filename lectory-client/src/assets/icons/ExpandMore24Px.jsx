import React from "react";

export const ExpandMore24Px = ({ className }) => {
  return (
    <svg
      className={`expand-more-24px ${className}`}
      fill="none"
      height="21"
      viewBox="0 0 21 21"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M13.8906 7.87507L10.4956 11.2701L7.10059 7.87507C6.93711 7.71122 6.71517 7.61914 6.48371 7.61914C6.25226 7.61914 6.03032 7.71122 5.86684 7.87507C5.52559 8.21632 5.52559 8.76757 5.86684 9.10882L9.88309 13.1251C10.2243 13.4663 10.7756 13.4663 11.1168 13.1251L15.1331 9.10882C15.4743 8.76757 15.4743 8.21632 15.1331 7.87507C14.7918 7.54257 14.2318 7.53382 13.8906 7.87507Z"
        fill="#1B1B1B"
      />
    </svg>
  );
};

export default ExpandMore24Px;