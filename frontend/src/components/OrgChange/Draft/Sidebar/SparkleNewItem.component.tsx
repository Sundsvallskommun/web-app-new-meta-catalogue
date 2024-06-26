import React from 'react';

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="sparkle-icon">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 "
        className="slowpulse"
        fill="#D88E00"
      />
      <path
        d="M19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5z"
        fill="none"
        stroke="#D88E00"
        strokeWidth="2.5px"
        className="scale-75"
      />
      <path
        id="bottom"
        d="M19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"
        className="fastpulse"
        fill="#D88E00"
      />
    </svg>
  );
}
export default SparkleIcon;
