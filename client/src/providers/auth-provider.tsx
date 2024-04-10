"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

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

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<UserInfo>({ id: "", username: "" });

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) {
      if (pathname !== "/signup") {
        router.push("/login");
        return;
      }
    } else {
      const data: UserInfo = JSON.parse(userInfo);

      if (data) {
        setUser({
          id: data.id,
          username: data.username,
        });
      }

      setIsAuthed(true);
    }
  }, [isAuthed]);

  return <AuthContext.Provider value={{ isAuthed, setIsAuthed, user, setUser }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
