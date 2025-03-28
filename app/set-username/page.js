"use client";
import { useContext } from "react";
import { UserContext } from "../Provider";
import { notFound } from "next/navigation";
import UsernameForm from "../components/UsernameForm.js";

const SetUsernamePage = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return notFound();
  }

  return <UsernameForm />;
};

export default SetUsernamePage;
