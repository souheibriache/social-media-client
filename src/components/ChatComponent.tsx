import { useEffect, useRef, useState } from "react";
import defaultImage from "../assets/default-user.jpg";
import { Minus, Send, X } from "lucide-react";
import {
  ChatType,
  closeChat,
  MessageType,
  sendMessage,
  toggleChatVisibility,
} from "../redux/auth/chat-slice";
import { useDispatch, useSelector } from "react-redux";
import useSocket from "../utils/socket";

type Props = {
  chat: ChatType;
};

const ChatComponent = ({ chat }: Props) => {
  const dispatch = useDispatch();
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { VITE_BACKEND_URL } = import.meta.env;

  const { currentUser } = useSelector((state: any) => state.user);
  const socket = useSocket();

  const handleMinimize = (isMinimized: boolean) => {
    dispatch(toggleChatVisibility({ chatId: chat._id, isMinimized }));
  };

  const handleClose = () => {
    dispatch(closeChat({ chatId: chat._id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    const messageData = {
      recipientId: chat.recipient._id,
      content: messageContent,
    };

    socket?.emit("send_message", JSON.stringify(messageData));
    setMessageContent(""); // Clear the input field
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat]);

  useEffect(() => {
    if (socket) {
      socket.on("message_sent", (message) => {
        dispatch(sendMessage({ chatId: chat._id, message }));
      });

      socket.on("new_message", (message) => {
        dispatch(sendMessage({ chatId: chat._id, message }));
      });
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
      return () => {
        socket.off("new_message");
        socket.off("message_sent");
      };
    }
  }, [socket]);

  return (
    <div className="w-full flex flex-col bg-slate-500 min-w-64 max-w-64 max-h-80 rounded-t-md border-slate-600 border-2 relative">
      <div
        onClick={() => chat.isMinimized && handleMinimize(false)}
        className="text-white bg-slate-600 h-8 flex flex-row items-center justify-between px-2 py-1 cursor-pointer"
      >
        <div className="flex flex-row items-center gap-2">
          <img
            className="h-6 w-6 rounded-full"
            src={
              chat?.recipient?.profile?.picture
                ? `${VITE_BACKEND_URL}${chat?.recipient?.profile?.picture}`
                : defaultImage
            }
            alt={chat?.recipient?.userName}
          />
          <p>{chat?.recipient?.userName}</p>
        </div>
        <div className="flex flex-row self-center mr-0">
          <button onClick={() => !chat.isMinimized && handleMinimize(true)}>
            <Minus />
          </button>
          <button onClick={handleClose}>
            <X />
          </button>
        </div>
      </div>
      {!chat.isMinimized && (
        <>
          <div
            className="overflow-y-auto w-full overflow-x-clip bg-slate-100 flex flex-col h-64 justify-start p-1 gap-2"
            ref={messagesEndRef}
          >
            {!chat?.messages?.length ? (
              <p className="mt-2 max-w-48 font-semibold text-slate-800 self-center text-center flex flex-col items-center">
                Start a conversation with{" "}
                <span className="font-bold">{chat.recipient.userName}</span>
              </p>
            ) : (
              chat.messages.map((message: MessageType, index: number) => {
                const isSender = message.sender._id === currentUser?.userId;
                const messageTimestamp = new Date(message.timestamp);
                const today = new Date();
                const isToday =
                  messageTimestamp.getDate() === today.getDate() &&
                  messageTimestamp.getMonth() === today.getMonth() &&
                  messageTimestamp.getFullYear() === today.getFullYear();
                const formattedTimestamp = isToday
                  ? messageTimestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : `${messageTimestamp.toLocaleDateString()} ${messageTimestamp.toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}`;

                return (
                  <div
                    key={index}
                    className={`flex w-full ${
                      isSender ? "justify-end" : "justify-start"
                    } items-center gap-2`}
                  >
                    {!isSender && (
                      <img
                        className="h-6 w-6 rounded-full object-cover"
                        src={
                          message.sender?.profile?.picture
                            ? `${VITE_BACKEND_URL}${message.sender?.profile?.picture}`
                            : defaultImage
                        }
                        alt={message.sender?.userName}
                      />
                    )}
                    <div
                      className={`flex group ${
                        isSender ? "flex-row-reverse" : "flex-row"
                      } items-center gap-2`}
                    >
                      <div
                        className={`rounded-lg p-2 max-w-xs ${
                          isSender ? "bg-slate-700 text-white" : "bg-slate-300"
                        }`}
                      >
                        <p className="max-w-40 break-before-all break-words">
                          {message.content}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 invisible group-hover:visible">
                        {formattedTimestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="w-full bg-white">
            <form
              onSubmit={handleSubmit}
              className="flex flex-row items-center"
            >
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full px-2 py-2 text-slate-800 text-sm border-none outline-none"
                placeholder="Write a message..."
              />
              <button
                disabled={messageContent.trim() === ""}
                className="disabled:opacity-80"
                type="submit"
              >
                <Send className="p-1 rounded-full text-white mr-1 h-6 w-6 bg-slate-700" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatComponent;
