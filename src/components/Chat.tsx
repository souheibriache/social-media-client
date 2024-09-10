import React, { useEffect, useRef, useState } from "react";
import defaultImage from "../assets/default-user.jpg";
import { Loader, Menu, MessageCircle, SendHorizonal } from "lucide-react";
import { formatTimeStamp } from "../utils/methods";
import { getChatById } from "../utils/api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useSocket from "../utils/socket";

type Props = {
  chatId?: string;
};

const Chat = ({ chatId }: Props) => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const { currentUser } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageContent, setMessageContent] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [chatUser, setChatUser] = useState<any>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    const messageData = {
      recipientId: chatUser._id,
      content: messageContent,
    };

    socket?.emit("send_message", JSON.stringify(messageData));
    setMessageContent(""); // Clear the input field
  };

  // Fetch messages whenever chatId changes
  useEffect(() => {
    setLoading(true);
    setChatUser(null);
    setMessageContent("");
    setMessages([]);
    setLastMessage(null);

    const getMessages = async () => {
      await getChatById(chatId as string)
        .then((response) => {
          setMessages(response.data.messages);
          setChatUser(response.data.recipient);
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => setLoading(false));
    };

    if (chatId) {
      getMessages();
      socket?.emit("see_messages", JSON.stringify({ chatId }));
    }
  }, [chatId]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, lastMessage]);

  // Listen for `message_seen` event and update the last seen message
  useEffect(() => {
    if (socket) {
      const handleMessageSeen = (message: any) => {
        setLastMessage(message);
      };

      const handleMessageSent = (message: any) => {
        if (message.chat === chatId) {
          setMessages((prevMessages: any) => [...prevMessages, message]);
          setLastMessage(message);
        }
      };

      const handleNewMessage = (message: any) => {
        if (message.chat === chatId) {
          setMessages((prevMessages: any) => [...prevMessages, message]);
          setLastMessage(message);
          socket?.emit("see_messages", JSON.stringify({ chatId }));
        }
      };

      socket.on("message_seen", handleMessageSeen);
      socket.on("message_sent", handleMessageSent);
      socket.on("new_message", handleNewMessage);

      return () => {
        socket.off("message_seen", handleMessageSeen);
        socket.off("message_sent", handleMessageSent);
        socket.off("new_message", handleNewMessage);
      };
    }
  }, [socket, chatId]);

  return (
    <div className="w-full flex flex-col items-center h-full">
      <div className="header flex flex-row px-3 py-2 items-center w-full gap-2">
        {chatId && chatUser ? (
          <>
            <img
              src={
                chatUser.profile.picture
                  ? VITE_BACKEND_URL + chatUser.profile.picture
                  : defaultImage
              }
              className="min-w-10 max-w-10 h-10 rounded-full object-cover"
            />
            <p className="text-lg font-semibold text-slate-700 w-full">
              {chatUser.userName}
            </p>
            <Menu className="cursor-pointer" />
          </>
        ) : (
          <p className="text-lg font-semibold text-slate-700 w-full text-center py-1">
            Start a new message
          </p>
        )}
      </div>
      <hr className="border-slate-700 w-11/12" />

      <div
        className="flex flex-col gap-2 w-full h-full overflow-y-auto px-2 py-3"
        ref={chatRef}
      >
        {chatId ? (
          loading ? (
            <Loader className="animate-spin m-auto text-slate-900" />
          ) : !messages.length ? (
            <div className="w-full flex flex-col items-center gap-3">
              <img
                className="h-20 w-20 rounded-full object-cover"
                src={defaultImage}
              />
              <p className="text-lg text-slate-900">
                Start a conversation with{" "}
                <span className="font-semibold">{chatUser?.userName}</span>
              </p>
            </div>
          ) : (
            <>
              {messages.map((message: any) => (
                <div
                  key={message._id}
                  className={`flex flex-row gap-1 items-center group ${
                    message.sender._id === currentUser.userId
                      ? "self-end flex-row-reverse"
                      : ""
                  }`}
                >
                  {message.sender._id !== currentUser.userId && (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        message?.sender?.profile?.picture
                          ? VITE_BACKEND_URL + message?.sender?.profile?.picture
                          : defaultImage
                      }
                    />
                  )}
                  <p
                    className={`p-2 rounded-md max-w-sm break-words ${
                      message.sender._id === currentUser.userId
                        ? "bg-slate-700 text-white rounded-se-none"
                        : "bg-slate-200 text-slate-700 rounded-ss-none"
                    }`}
                  >
                    {message.content}
                  </p>
                  <span className="invisible group-hover:visible text-sm text-slate-500">
                    {formatTimeStamp(message.timestamp)}{" "}
                  </span>
                </div>
              ))}

              {lastMessage?.sender._id === currentUser.userId &&
                lastMessage.seenAt && (
                  <p className="text-xs text-slate-500 self-end">
                    Seen at: {formatTimeStamp(lastMessage.seenAt)}
                  </p>
                )}
            </>
          )
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <MessageCircle className="h-12 w-12 text-slate-900" />
            <p className="text-lg text-slate-900">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
      {chatId && chatUser && (
        <form
          className="flex flex-row gap-3 items-center w-full px-2 py-3"
          onSubmit={handleSendMessage}
        >
          <input
            className="p-3 h-12 w-full rounded-md border focus:outline-none"
            placeholder="Type your message"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 h-12 w-12 rounded-md"
          >
            <SendHorizonal className="w-full h-full" />
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat;
