import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { fetchFriends } from "../utils/api";
import { toast } from "sonner";

type Props = {};

const Friends = ({}: Props) => {
  const [friends, setFriends] = useState([]);
  const [loading, setIsLoading] = useState(true);
  useEffect(() => {
    const getFriends = async () => {
      await fetchFriends()
        .then((response) => {
          console.log({ response: response.payload });
          setFriends(response.payload);

          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setIsLoading(false);
        });
    };
    getFriends();
  }, []);

  return (
    <div className="flex flex-col items-start w-full p-2 h-fit container">
      <h2 className="font-semibold text-lg">Friends</h2>
      {loading ? (
        <Loader className="self-center" />
      ) : (
        <div className="flex flex-col gap-2 w-full max-h-96 overflow-visible">
          {friends.length ? (
            friends?.map((friend: any, index: number) => (
              <UserProfile
                key={index}
                _id={friend._id}
                userName={friend.userName}
                picture={friend.profile.picture}
                friend={true}
              />
            ))
          ) : (
            <p>You have no friends</p>
          )}
        </div>
      )}
    </div>
  );
};
export default Friends;
