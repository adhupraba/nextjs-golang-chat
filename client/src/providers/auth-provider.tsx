"use client";

import React, { createContext, useState } from "react";

export type UserInfo = {
  id: string;
  username: string;
};

type AuthContextType = {
  isAuthed: boolean;
  setIsAuthed: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserInfo;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthed: false,
  setIsAuthed: () => {},
  user: { id: "", username: "" },
  setUser: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<UserInfo>({ id: "", username: "" });

  return <AuthContext.Provider value={{ isAuthed, setIsAuthed, user, setUser }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
