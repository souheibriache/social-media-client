import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { fetchInvitations } from "../utils/api";
import { toast } from "sonner";

type Props = {};

const Invitations = ({}: Props) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setIsLoading] = useState(true);
  useEffect(() => {
    const getInvitations = async () => {
      await fetchInvitations()
        .then((response) => {
          setInvitations(response.payload.invitations);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setIsLoading(false);
        });
    };
    getInvitations();
  }, []);

  return (
    <div className="flex flex-col items-start w-full p-2 h-fit container">
      <h2 className="font-semibold text-lg">Invitations</h2>
      {loading ? (
        <Loader className="self-center" />
      ) : (
        <div className="flex flex-col gap-2 w-full max-h-96 overflow-visible">
          {invitations.length ? (
            invitations?.map((invitation: any, index: number) => (
              <UserProfile
                key={index}
                _id={invitation.sender._id}
                userName={invitation.sender.userName}
                picture={invitation.sender.profile.picture}
              />
            ))
          ) : (
            <p>You have no invitations</p>
          )}
        </div>
      )}
    </div>
  );
};
export default Invitations;
