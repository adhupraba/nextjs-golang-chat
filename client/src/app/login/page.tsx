"use client";

import { apiUrl } from "@/constants";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/providers/auth-provider";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();

      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (res.ok) {
        const user: UserInfo = {
          id: json.id,
          username: json.username,
        };

        localStorage.setItem("userInfo", JSON.stringify(user));

        return router.replace("/");
      }
    } catch (err) {
      console.error("handle submit error =>", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-w-full min-h-screen">
      <form className="flex flex-col md:w-1/5" onSubmit={handleSubmit}>
        <div className="text-3xl font-bold text-center">
          <span className="text-blue">welcome!</span>
        </div>
        <input
          type="email"
          placeholder="email"
          className="p-3 mt-8 rounded-md border border-grey focus:outline-none focus:border-blue"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="p-3 mt-4 rounded-md border border-grey focus:outline-none focus:border-blue"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="p-3 mt-6 rounded-md bg-blue font-bold text-white">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
