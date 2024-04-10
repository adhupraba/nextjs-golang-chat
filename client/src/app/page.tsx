"use client";
import { apiUrl, websocketUrl } from "@/constants";
import { useAuth } from "@/providers/auth-provider";
import { useWebSocket } from "@/providers/ws-provider";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useState } from "react";

type Room = {
  id: string;
  name: string;
};

const HomePage = () => {
  const router = useRouter();

  const { user } = useAuth();
  const { setConn } = useWebSocket();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    try {
      const res = await fetch(`${apiUrl}/ws/get-rooms`, { method: "GET" });
      const json = await res.json();

      if (!res.ok) {
        console.error("get rooms json =>", json);
        throw new Error("Something went wrong when fetching rooms");
      }

      setRooms(json);
    } catch (err) {
      console.error("get rooms error =>", err);
    }
  };

  const handleCreateRoom: MouseEventHandler<HTMLButtonElement> = async (e) => {
    try {
      e.preventDefault();

      const res = await fetch(`${apiUrl}/ws/create-room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: crypto.randomUUID(),
          name: roomName,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        console.error("handle create room json =>", json);
        throw new Error("Something went wrong when creating room");
      }

      setRoomName("");
      getRooms();
    } catch (err) {
      console.error("handle create room error =>", err);
    }
  };

  const handleJoinRoom = async (id: string) => {
    const ws = new WebSocket(`${websocketUrl}/ws/join-room/${id}?userId=${user.id}&username=${user.username}`);

    if (ws.OPEN) {
      setConn(ws);
      router.push(`/chat/${id}`);
      return;
    }
  };

  return (
    <>
      <div className="my-8 px-4 md:mx-32 w-full h-full">
        <div className="flex justify-center mt-3 p-5">
          <input
            type="text"
            className="border border-grey p-2 rounded-md focus:outline-none focus:border-blue"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button className="bg-blue border text-white rounded-md p-2 md:ml-4" onClick={handleCreateRoom}>
            Create Room
          </button>
        </div>

        <div className="mt-6">
          <div className="font-bold">Available Rooms</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {rooms.map((room, idx) => (
              <div key={idx} className="border border-blue p-4 flex items-center rounded-md w-full">
                <div className="w-full">
                  <div className="text-sm">Room</div>
                  <div className="text-blue font-bold text-lg">{room.name}</div>
                </div>
                <div className="">
                  <button className="px-4 py-2 text-white bg-blue rounded-md" onClick={() => handleJoinRoom(room.id)}>
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
