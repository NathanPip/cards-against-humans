import Link from "next/link";
import React from "react";
// import { TRPCError } from "@trpc/server";

const Error = () => {
  return (
    <div className=" flex h-screen justify-center ">
      <div className=" flex flex-col items-center justify-center space-y-10">
        <svg
          stroke="currentColor"
          fill="red"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="9em"
          width="9em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.001 10H13.001V15H11.001zM11 16H13V18H11z"></path>
          <path d="M13.768,4.2C13.42,3.545,12.742,3.138,12,3.138s-1.42,0.407-1.768,1.063L2.894,18.064 c-0.331,0.626-0.311,1.361,0.054,1.968C3.313,20.638,3.953,21,4.661,21h14.678c0.708,0,1.349-0.362,1.714-0.968 c0.364-0.606,0.385-1.342,0.054-1.968L13.768,4.2z M4.661,19L12,5.137L19.344,19H4.661z"></path>
        </svg>
        <h1 className="font-bold">Oops! Something went wrong.</h1>
        <p className="font-bold ">
          <Link className="italic underline" href="/">
            Click me
          </Link>{" "}
          to go back while we try to resolve this issue.
        </p>
      </div>
    </div>
  );
};

export default Error;
