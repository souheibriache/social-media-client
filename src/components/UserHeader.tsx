import { Menu } from "lucide-react";
import defaultProfilePic from "../assets/default-user.jpg";
import TimeAgo from "javascript-time-ago";

type UserHeaderProps = {
  userName: string;
  profilePicture: string | null;
  createdAt: Date;
};

const UserHeader = ({
  userName,
  profilePicture,
  createdAt,
}: UserHeaderProps) => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const timeAgo = new TimeAgo("en-US");

  return (
    <div className="flex flex-row w-full px-3">
      <img
        className="h-12 w-12 rounded-full object-cover"
        src={
          profilePicture ? VITE_BACKEND_URL + profilePicture : defaultProfilePic
        }
        alt=""
      />
      <div className="flex flex-col justify-between ml-2 w-full">
        <p className="text-slate-800 font-semibold text-lg">{userName}</p>
        <p className="text-slate-500 text-sm">
          {timeAgo.format(new Date(createdAt))}
        </p>
      </div>
      <button className="">
        <Menu />
      </button>
    </div>
  );
};

export default UserHeader;
