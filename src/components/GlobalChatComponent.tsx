import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatComponent from "./ChatComponent";
import { ChatType, openChat } from "../redux/auth/chat-slice";
import useSocket from "../utils/socket";
import { getChatByRecipientId } from "../utils/api";

type Props = {};

const GlobalChatComponent = ({}: Props) => {
  const { currentUser } = useSelector((state: any) => state.user);
  const { hasProfile } = useSelector((state: any) => state.auth);
  const { chatSessions } = useSelector((state: any) => state.chat);
  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("new_message", async (message) => {
        await getChatByRecipientId(message.sender._id)
          .then((response) => {
            console.log({ response });
            dispatch(openChat({ chat: response.data }));
          })
          .catch((error) => console.log(error));
      });

      return () => {
        socket.off("message_sent");
      };
    }
  }, [socket]);
  return currentUser && hasProfile ? (
    <div className="z-20 fixed right-0 bottom-0 flex flex-row-reverse justify-start gap-1 items-end">
      <div className="  m-5 bg-slate-400 rounded-full h-14 w-14 min-h-14 min-w-14 flex items-center  justify-center ease duration-300 hover:scale-105">
        <Plus className="relative m-auto text-white h-10 w-10" />
      </div>
      {chatSessions.map((chat: ChatType, index: number) => (
        <ChatComponent chat={chat} key={index} />
      ))}
    </div>
  ) : (
    <></>
  );
};
export default GlobalChatComponent;
