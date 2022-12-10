import React from "react";

const Loading = () => {
  return (
    <div className="bg-grey flex h-screen items-center justify-center">
      <div className="rounded-full bg-white p-4">
        <svg
          className="duration-3s h-8 w-8 animate-spin text-gray-700"
          fill="currentColor"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Loading;
