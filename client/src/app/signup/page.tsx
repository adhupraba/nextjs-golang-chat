"use client";

import { apiUrl } from "@/constants";
import { FormEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserInfo, useAuth } from "@/providers/auth-provider";
import Link from "next/link";

const SignupPage = () => {
  const router = useRouter();

  const { isAuthed } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthed) {
      router.push("/");
      return;
    }
  }, [isAuthed]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();

      const res = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });
      const json = await res.json();

      if (!res.ok) {
        console.error("handle submit json =>", json);
        throw new Error("Something went wrong when signing up");
      }

      const user: UserInfo = {
        id: json.id,
        username: json.username,
      };

      localStorage.setItem("userInfo", JSON.stringify(user));

      return router.replace("/");
    } catch (err) {
      console.error("handle submit error =>", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-w-full min-h-screen">
      <form className="flex flex-col md:w-1/5" onSubmit={handleSubmit}>
        <div className="text-3xl font-bold text-center">
          <span className="text-blue">register!</span>
        </div>
        <input
          type="text"
          placeholder="username"
          className="p-3 mt-8 rounded-md border border-grey focus:outline-none focus:border-blue"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          className="p-3 mt-4 rounded-md border border-grey focus:outline-none focus:border-blue"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="p-3 mt-4 rounded-md border border-grey focus:outline-none focus:border-blue"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="p-3 mt-6 rounded-md bg-blue font-bold text-white">
          signup
        </button>
        <div className="mt-6 text-center">
          already have an account?{" "}
          <Link href="/login" className="text-blue underline">
            login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
