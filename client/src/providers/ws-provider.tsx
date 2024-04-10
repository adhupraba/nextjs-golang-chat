"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type Conn = WebSocket | null;

type WebSocketContextType = {
  conn: Conn;
  setConn: React.Dispatch<React.SetStateAction<Conn>>;
};

export const WebSocketContext = createContext<WebSocketContextType>({
  conn: null,
  setConn: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [conn, setConn] = useState<Conn>(null);

  return <WebSocketContext.Provider value={{ conn, setConn }}>{children}</WebSocketContext.Provider>;
};
