"use client";
import { useContext } from "react";
import { UserContext } from "../Provider";
import Link from "next/link";

function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || (
        <Link
          href="/sign-in"
          className="text-navy hover:text-navy-light underline font-semibold transition duration-200"
        >
          You must be signed in
        </Link>
      );
}

export default AuthCheck;
