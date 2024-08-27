import { Check, Loader, MessageCircle, Plus, X } from "lucide-react";
import { useState } from "react";
import defaultProfilePic from "../assets/default-user.jpg";
import { Link } from "react-router-dom";
import {
  acceptFriendRequest,
  addFriend,
  cancelRequest,
  getUserById,
  rejectFriendRequest,
  unfriendUser,
} from "../utils/api";
import { toast } from "sonner";
import AcceptInvitationButton from "./AcceptInvitationButton";

type Props = {
  key: number;
  user: any;
};

const AddButtonAction = ({ invitationStatus }: any) => {
  switch (invitationStatus) {
    case "friends":
      return (
        <>
          Unfriend <X />
        </>
      );
    case "invitationSent":
      return (
        <>
          Cancel <X />
        </>
      );

    case "invitationReceived":
      return (
        <>
          Accept <Check />
        </>
      );
    default:
      return (
        <>
          Add <Plus />
        </>
      );
  }
};

const UserListItem = ({ key, user }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemListUser, setItemListUser] = useState(user);
  const { VITE_BACKEND_URL } = import.meta.env;

  const invitationStatusText = () => {
    switch (itemListUser.invitationStatus) {
      case "friends":
        return <p>You are already friends</p>;
      case "invitationSent":
        return <p>Invitation Sent</p>;
      case "invitationReceived":
        return <p>Sent you a friend request</p>;
      default:
        return <></>;
    }
  };

  const handleUser = async (action?: "Accept" | "Reject") => {
    setIsLoading(true);
    switch (itemListUser.invitationStatus) {
      case "invitationSent":
        await cancelRequest(itemListUser._id).then((data) => {
          toast.success(data.message);
        });
        break;
      case "invitationReceived":
        if (action === "Accept")
          await acceptFriendRequest(itemListUser._id).then((data) => {
            toast.success(data.message);
          });
        else
          await rejectFriendRequest(itemListUser._id).then((data) => {
            toast.success(data.message);
          });
        break;
      case "friends":
        await unfriendUser(itemListUser._id).then((data) => {
          toast.success(data.message);
        });
        break;
      default:
        await addFriend(itemListUser._id).then((data) => {
          toast.success(data.message);
        });
        break;
    }

    await getUserById(itemListUser._id).then((data) => {
      console.log({ dataPayload: data });
      setItemListUser(data.payload);
    });

    setIsLoading(false);
  };
  return (
    <li key={key} className="flex flex-row w-full justify-start">
      <Link to={`/profile/${itemListUser._id}`}>
        <img
          src={
            itemListUser?.profile?.picture
              ? `${VITE_BACKEND_URL}${itemListUser.profile.picture}`
              : defaultProfilePic
          }
          alt={itemListUser.userName}
          className="object-cover min-w-20 max-w-20 h-20 rounded-full"
        />
      </Link>
      <div className="flex flex-col ml-3 justify-between ">
        <Link to={`/profile/${itemListUser._id}`}>
          <p className="font-semibold text-slate-600">
            {itemListUser.userName}
          </p>
        </Link>
        <>{invitationStatusText()}</>
        <div className="flex flex-row gap-2 mt-1">
          {itemListUser.invitationStatus === "invitationReceived" ? (
            <AcceptInvitationButton handleUser={handleUser} />
          ) : (
            <button
              disabled={isLoading}
              onClick={() => handleUser()}
              className="bg-slate-600 text-white px-3 py-1 rounded-md flex flex-row gap-1 font-semibold disabled:bg-opacity-90 min-w-24 justify-between items-center"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <AddButtonAction
                  invitationStatus={itemListUser.invitationStatus}
                />
              )}
            </button>
          )}
          <button className="bg-slate-600 text-white px-3 py-1 rounded-md flex flex-row gap-1 font-semibold">
            Message <MessageCircle />
          </button>
        </div>
      </div>
    </li>
  );
};
export default UserListItem;
