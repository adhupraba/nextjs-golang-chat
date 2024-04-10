"use client";

import autosize from "autosize";
import ChatBody from "@/components/chat-body";
import { apiUrl, websocketUrl } from "@/constants";
import { useWebSocket } from "@/providers/ws-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/auth-provider";

export type Message = {
  content: string;
  clientId: string;
  username: string;
  roomId: string;
  type: "recv" | "self";
};

export type Client = {
  username: string;
};

const ChatPage = () => {
  const { user } = useAuth();
  const { conn, setConn } = useWebSocket();

  const router = useRouter();
  const pathname = usePathname();

  const [messages, setMessages] = useState<Message[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // get clients in the room
  useEffect(() => {
    if (!user.id) {
      return;
    }

    const roomId = pathname.split("/")[1];

    const getClients = async () => {
      try {
        const res = await fetch(`${apiUrl}/ws/get-clients/${roomId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();

        if (!res.ok) {
          console.error("get client json =>", json);
          throw new Error("Something went wrong when fetching clients in room");
        }

        setClients(json);
      } catch (err) {
        console.error("get clients error =>", err);
      }
    };

    getClients();
  }, [user.id]);

  // handle websocket connection
  useEffect(() => {
    if (inputRef.current) {
      autosize(inputRef.current);
    }

    if (!user.id) {
      return;
    }

    console.log("conn =>", conn);

    // detect navigation between pages
    window.onpopstate = (ev) => {
      console.log("on pop state called =>", ev);
      conn?.close();
      setConn(null);
    };

    if (conn === null) {
      const roomId = pathname.split("/")[2];
      const ws = new WebSocket(`${websocketUrl}/ws/join-room/${roomId}?userId=${user.id}&username=${user.username}`);

      if (ws.OPEN) {
        console.log("opened ws connection");
        setConn(ws);
      }

      return;
    }

    conn.onmessage = (message) => {
      console.log("conn on message =>", message);

      const msg: Message = JSON.parse(message.data);

      if (msg.content.includes("has joined the room")) {
        setClients((prev) => [...prev, { username: msg.username }]);
      }

      if (msg.content.includes("left the chat")) {
        setClients((prev) => prev.filter((client) => client.username !== msg.username));
        setMessages((prev) => [...prev, msg]);
        return;
      }

      msg.type = user.username === msg.username ? "self" : "recv";

      setMessages((prev) => [...prev, msg]);
    };

    conn.onclose = (ev) => {
      console.log("websocket conn closed =>", ev);
    };

    conn.onerror = (ev) => {
      console.log("websocket conn errored =>", ev);
    };

    conn.onopen = (ev) => {
      console.log("websocket conn opened =>", ev);
    };

    return () => {
      console.log("calling cleanup func");

      conn?.close();
      conn.onmessage = null;
      conn.onerror = null;
      conn.onopen = null;
      conn.onclose = null;

      setConn(null);
    };
  }, [user.id, inputRef, conn]);

  const handleSendMessage = () => {
    const msg = inputRef.current?.value;

    if (!msg) return;

    // check connection
    if (conn === null) {
      router.push("/");
      return;
    }

    conn.send(msg);
    inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col w-full">
      <ChatBody data={messages} />

      <div className="fixed bottom-0 mt-4 w-full">
        <div className="flex md:flex-row px-4 py-2 bg-grey md:mx-4 rounded-md">
          <div className="flex w-full mr-4 rounded-md border border-blue">
            <textarea
              ref={inputRef}
              placeholder="Type your message here"
              className="w-full h-10 p-2 rounded-md focus:outline-none resize-none"
            />
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-md bg-blue text-white" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
