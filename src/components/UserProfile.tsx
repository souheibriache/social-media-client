type Props = {
  _id: string;
  userName: string;
  picture: string;
  friend?: boolean;
};
import { Link } from "react-router-dom";
import defaultPicture from "../assets/default-user.jpg";
import { useState } from "react";
import {
  acceptFriendRequest,
  getChatByRecipientId,
  unfriendUser,
} from "../utils/api";
import { toast } from "sonner";
import { Loader, MessageCircle } from "lucide-react";
import { openChat } from "../redux/auth/chat-slice";
import { useDispatch } from "react-redux";

export default function UserProfile({ _id, userName, picture, friend }: Props) {
  const [invitationStatus, setInvitationStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { VITE_BACKEND_URL } = import.meta.env;
  const dispatch = useDispatch();

  const handleUserAction = async (
    action: "accept" | "reject" | "unfriend" | "chat"
  ) => {
    setLoading(true);
    switch (action) {
      case "accept":
        await acceptFriendRequest(_id)
          .then(() => setInvitationStatus("Accepted"))
          .catch((err) => toast.error(err.message));
        break;
      case "reject":
        await acceptFriendRequest(_id)
          .then(() => setInvitationStatus("Rejected"))
          .catch((err) => toast.error(err.message));
        break;

      case "unfriend":
        await unfriendUser(_id)
          .then(() => setInvitationStatus("Removed"))
          .catch((err) => toast.error(err.message));
        break;
      case "chat":
        await getChatByRecipientId(_id)
          .then((response) => {
            console.log({ response });
            dispatch(openChat({ chat: response.data }));
          })
          .catch((error) => console.log(error));
        break;
      default:
        break;
    }
    setLoading(false);
  };
  return (
    <div className="bg-white rounded-md h-18 flex flex-row items-center p-2 shadow-lg">
      <Link to={`/profile/${_id}`}>
        <img
          src={picture ? VITE_BACKEND_URL + picture : defaultPicture}
          alt={userName}
          className="object-cover max-w-12 min-w-12 h-12 rounded-full"
        />
      </Link>
      <div className="flex flex-col justify-between ml-2 w-full h-full rounded-md">
        <Link to={`/profile/${_id}`}>
          <p className="text-md font-semibold">{userName}</p>
        </Link>
        <div className="flex flex-row justify-start gap-1 rounded-md">
          {loading ? (
            <Loader className="animate-spin w-full" />
          ) : !!invitationStatus ? (
            <button className="bg-gray-200 w-full text-sm px-5 py-0.5 text-center rounded-md text-slate-600 font-semibold">
              {invitationStatus}
            </button>
          ) : friend ? (
            <>
              <button
                onClick={() => handleUserAction("unfriend")}
                className="bg-slate-600 w-full text-sm px-5 py-0.5 text-center rounded-md text-white font-semibold"
              >
                Unfriend
              </button>
              <button
                onClick={() => handleUserAction("chat")}
                className="bg-gray-200 w-full text-sm px-5 py-0.5 flex flex-row gap-1 text-center rounded-md text-slate-600 font-semibold"
              >
                Chat <MessageCircle className="h-5 w-5 p-0.5" />
              </button>{" "}
            </>
          ) : (
            <>
              <button
                onClick={() => handleUserAction("accept")}
                className="bg-slate-600 w-full text-sm px-5 py-0.5 text-center rounded-md text-white font-semibold"
              >
                Accept
              </button>
              <button
                onClick={() => handleUserAction("reject")}
                className="bg-gray-200 w-full text-sm px-5 py-0.5 text-center rounded-md text-slate-600 font-semibold"
              >
                Reject
              </button>{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
