import { Link, useParams } from "react-router-dom";
import defaultProfile from "../assets/default-user.jpg";
import Chat from "../components/Chat";
import { wordToDots } from "../utils/methods";
import { timeAgo } from "../utils/timeago";
import { useEffect, useState } from "react";
import { fetchChats } from "../utils/api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
import useSocket from "../utils/socket";

const Messages = () => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const { chatId } = useParams();
  const [chats, setChats] = useState<any>([]);
  const { currentUser } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const socket = useSocket();

  // Fetch the user's chats
  useEffect(() => {
    const getChats = async () => {
      setLoading(true);
      try {
        const response = await fetchChats();
        if (response.data) {
          setChats(
            response.data.sort(
              (a: any, b: any) =>
                new Date(b.lastMessage.timestamp).getTime() -
                new Date(a.lastMessage.timestamp).getTime()
            )
          );
        }
      } catch (error: any) {
        toast.error(error?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    getChats();
  }, []);

  const reorderChats = () => {
    setChats((chats: any) =>
      chats.sort(
        (a: any, b: any) =>
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
      )
    );
  };

  // Emit the `see_messages` event and update the chat seen status
  const markMessagesAsSeen = (chatId: string) => {
    if (socket) {
      socket.emit("see_messages", JSON.stringify({ chatId }));
    }
  };

  // Handle socket events for new messages and seen updates
  useEffect(() => {
    if (socket) {
      const handleMessage = (message: any) => {
        setChats((prevChats: any) => {
          const updatedChats = prevChats.map((chat: any) => {
            if (chat._id === message.chat) {
              return {
                ...chat,
                lastMessage: message,
              };
            }
            return chat;
          });
          return updatedChats;
        });
        reorderChats();
      };

      // Listen for seen updates
      const handleSeenMessage = (message: any) => {
        setChats((prevChats: any) =>
          prevChats.map((chat: any) =>
            chat._id === message.chat
              ? {
                  ...chat,
                  lastMessage: message,
                }
              : chat
          )
        );
      };

      socket.on("message_sent", handleMessage);
      socket.on("new_message", handleMessage);
      socket.on("message_seen", handleSeenMessage);

      return () => {
        socket.off("message_sent", handleMessage);
        socket.off("new_message", handleMessage);
        socket.off("message_seen", handleSeenMessage);
      };
    }
  }, [socket, chatId]);
  // Trigger `see_messages` event when a chat is opened (chatId changes)
  useEffect(() => {
    if (chatId) {
      markMessagesAsSeen(chatId);
    }
  }, [chatId]);

  return (
    <div className="container h-full w-full flex flex-row gap-3 pt-5">
      <div className="chats flex flex-col w-1/3 bg-slate-100 rounded-md items-center">
        <div className="header fonr font-bold w-full text-center py-4 hidden md:block">
          Chats
        </div>
        <hr className="w-5/6 border-slate-500 hidden md:block" />
        {loading ? <Loader className="animate-spin" /> : null}
        <div className="flex flex-col gap-2 md:gap-0 w-full max-h-full overflow-auto">
          {chats?.map((chat: any, index: number) => (
            <Link to={`/messages/${chat._id}`} key={index}>
              <div
                className={`flex flex-row w-full items-stretch justify-between hover:bg-white gap-2 px-2 md:px-4 md:py-3 cursor-pointer duration-200 ease ${
                  chat._id === chatId ? "bg-white" : ""
                }`}
              >
                <img
                  className="h-12 w-12 min-w-12 rounded-full object-cover"
                  src={
                    chat?.recipient?.profile?.picture
                      ? VITE_BACKEND_URL + chat?.recipient?.profile?.picture
                      : defaultProfile
                  }
                  alt={chat?.recipient?.userName}
                />
                <div
                  className={`hidden md:flex flex-col w-full justify-between ${
                    chat?.lastMessage?.seenAt === null &&
                    chat?.lastMessage?.sender._id !== currentUser.userId
                      ? "font-semibold"
                      : ""
                  }`}
                >
                  <div className="flex flex-row justify-between gap-2 w-full">
                    <p>{chat?.recipient?.userName}</p>
                    {chat?.lastMessage?.timestamp && (
                      <p>
                        {timeAgo.format(new Date(chat?.lastMessage?.timestamp))}
                      </p>
                    )}
                  </div>
                  {chat?.lastMessage ? (
                    <p>
                      {chat?.lastMessage?.sender._id === currentUser.userId
                        ? "You: "
                        : ""}
                      {wordToDots(chat?.lastMessage?.content, 15)}
                    </p>
                  ) : (
                    <p>Start a conversation with {chat?.recipient?.userName}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-slate-100 md:w-2/3 w-5/6 rounded-md chats">
        <Chat chatId={chatId} />
      </div>
    </div>
  );
};

export default Messages;
