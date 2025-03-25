"use client";
import { createContext } from "react";
import { useUserData } from "./lib/hooks";

export const UserContext = createContext({
  user: null,
  username: null,
  role: null,
});

function Provider({ children }) {
  const userData = useUserData();
  console.log("userData from Provider", userData);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}

export default Provider;
