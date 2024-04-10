import { Message } from "@/app/chat/[id]/page";
import { FC } from "react";

interface IChatBodyProps {
  data: Message[];
}

const ChatBody: FC<IChatBodyProps> = ({ data }) => {
  return (
    <div className="p-4 md:mx-6 mb-14">
      {data.map((message, idx) => {
        if (message.type === "self") {
          return (
            <div key={idx} className="flex flex-col mt-2 w-full text-right justify-end">
              <div className="text-sm">{message.username}</div>
              <div>
                <div className="bg-blue text-white px-4 py-1 rounded-md inline-block mt-1">{message.content}</div>
              </div>
            </div>
          );
        } else {
          return (
            <div key={idx} className="mt-2">
              <div className="text-sm">{message.username}</div>
              <div>
                <div className="bg-grey text-dark-secondary px-4 py-1 rounded-md inline-block mt-1">
                  {message.content}
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ChatBody;
