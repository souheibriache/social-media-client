import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import defaultPicture from "../assets/default-user.jpg";
import {
  acceptFriendRequest,
  addFriend,
  cancelRequest,
  getChatByRecipientId,
  getUserById,
  rejectFriendRequest,
  unfriendUser,
} from "../utils/api";
import { Loader, MessageCircle, Plus, X, Check } from "lucide-react";
import { openChat } from "../redux/auth/chat-slice";

type Props = {
  user: any;
};

const OtherUserProfile = ({ user }: Props) => {
  const [otherUser, setOtherUser] = useState(user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { VITE_BACKEND_URL } = import.meta.env;

  const [currentPicture, setCurrentPicture] = useState("");

  useEffect(() => {
    setCurrentPicture(
      user.profile?.picture ? `${VITE_BACKEND_URL}${user.profile.picture}` : ""
    );
  }, [user]);

  const handleUserAction = async (action?: "Accept" | "Reject") => {
    setIsLoading(true);
    try {
      switch (otherUser.invitationStatus) {
        case "invitationSent":
          await cancelRequest(otherUser._id);
          toast.success("Friend request canceled");
          break;
        case "invitationReceived":
          if (action === "Accept") {
            await acceptFriendRequest(otherUser._id);
            toast.success("Friend request accepted");
          } else {
            await rejectFriendRequest(otherUser._id);
            toast.success("Friend request rejected");
          }
          break;
        case "friends":
          await unfriendUser(otherUser._id);
          toast.success("Unfriended successfully");
          break;
        default:
          await addFriend(otherUser._id);
          toast.success("Friend request sent");
          break;
      }

      // Refresh the user data to reflect changes in invitation status
      const updatedUser = await getUserById(otherUser._id);
      setOtherUser(updatedUser.payload);
    } catch (error) {
      toast.error("An error occurred while processing the request");
    } finally {
      setIsLoading(false);
    }
  };

  const dispatch = useDispatch();

  const handleChatButton = async () => {
    await getChatByRecipientId(user._id)
      .then((response) => {
        console.log({ response });
        dispatch(openChat({ chat: response.data }));
      })
      .catch((error) => console.log(error));
  };

  const renderActionButton = () => {
    switch (otherUser.invitationStatus) {
      case "friends":
        return (
          <button
            onClick={() => handleUserAction()}
            disabled={isLoading}
            className="bg-red-500 text-white px-3 py-1 rounded-md flex flex-row gap-1 font-semibold disabled:bg-opacity-90"
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>
                Unfriend <X />
              </>
            )}
          </button>
        );
      case "invitationSent":
        return (
          <button
            onClick={() => handleUserAction()}
            disabled={isLoading}
            className="bg-yellow-500 text-white px-3 py-1 rounded-md flex flex-row gap-1 font-semibold disabled:bg-opacity-90"
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>
                Cancel Request <X />
              </>
            )}
          </button>
        );
      case "invitationReceived":
        return (
          <>
            <button
              onClick={() => handleUserAction("Accept")}
              disabled={isLoading}
              className="bg-green-500 text-white px-3 py-1 rounded-md flex flex-row gap-1 font-semibold disabled:bg-opacity-90"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  Accept <Check />
                </>
              )}
            </button>
            <button
              onClick={() => handleUserAction("Reject")}
              disabled={isLoading}
              className="bg-red-500 text-white px-3 py-1 rounded-md flex flex-row gap-1 font-semibold disabled:bg-opacity-90"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  Reject <X />
                </>
              )}
            </button>
          </>
        );
      default:
        return (
          <button
            onClick={() => handleUserAction()}
            disabled={isLoading}
            className="bg-blue-500 text-white px-3 py-1 rounded-md flex flex-row gap-1 font-semibold disabled:bg-opacity-90"
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>
                Add Friend <Plus />
              </>
            )}
          </button>
        );
    }
  };

  return (
    <div className="container flex flex-col items-center mt-2">
      <h1 className="text-2xl font-bold">{otherUser.userName}'s Profile</h1>
      <div className="relative">
        <img
          className="h-32 w-32 rounded-full object-cover"
          src={currentPicture.length ? currentPicture : defaultPicture}
          alt={otherUser.userName}
        />
      </div>
      <div className="flex flex-col items-center mt-5">
        <p>Email: {otherUser.email}</p>
        <p>Gender: {otherUser.profile?.gender}</p>
        <p>Date of Birth: {otherUser.profile?.dateOfBirth?.slice(0, 10)}</p>
      </div>
      <div className="flex flex-row gap-3 mt-5">
        {renderActionButton()}
        <button
          onClick={handleChatButton}
          className="bg-blue-500 text-white px-3 py-1 rounded-md flex flex-row gap-1 font-semibold"
        >
          Message <MessageCircle />
        </button>
      </div>
    </div>
  );
};

export default OtherUserProfile;
