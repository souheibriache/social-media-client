import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile";

type Props = {};

const Invitations = ({}: Props) => {
  const [invitations, setInvitations] = useState([
    {
      _id: "1",
      userName: "User 1",
      picture:
        "https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      _id: "2",
      userName: "User 2",
      picture:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      _id: "3",
      userName: "User 3",
      picture:
        "https://images.unsplash.com/photo-1640951613773-54706e06851d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    },
    {
      _id: "4",
      userName: "User 4",
      picture:
        "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]);
  const [loading, setloading] = useState(true);
  const { accessToken } = useSelector((state: any) => state.auth);
  useEffect(() => {
    const getInvitations = async () => {
      const res = await fetch("/api/invitations/received", {
        method: "GET",
        headers: {
          "Content-Type": "json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      console.log({ data });
      if (data && data.payload) {
        setloading(false);
        setInvitations(data.payload);
      }
    };
    // accessToken && getInvitations();
  }, [accessToken]);

  return (
    <div className="flex flex-col items-start w-full p-2">
      <h2 className="font-semibold text-lg">Invitations</h2>
      {loading ? (
        <Loader className="self-center" />
      ) : (
        <div className="flex flex-col gap-2 w-full">
          {invitations.map((invitation, index) => (
            <UserProfile
              key={index}
              _id={invitation._id}
              userName={invitation.userName}
              picture={invitation.picture}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Invitations;
