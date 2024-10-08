import { useSelector } from "react-redux";
import defaultProfilePicture from "../assets/default-user.jpg";
import CreatePostModal from "./CreatePostModal";
import { useState } from "react";
import { Link } from "react-router-dom";

type Props = {};

const Post = ({}: Props) => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const { currentUser } = useSelector((state: any) => state.user);
  const [createPostVisible, setCreatePostVisible] = useState(false);
  return (
    <div className="px-3 flex bg-white flex-row h-full py-2 w-96 items-center rounded-md shadow-md">
      <Link to={`/profile/${currentUser?.userId}`}>
        <img
          className="h-12 max-w-12 min-w-12 object-cover rounded-full"
          src={
            currentUser?.picture
              ? `${VITE_BACKEND_URL}${currentUser.picture}`
              : defaultProfilePicture
          }
        />
      </Link>
      <button
        onClick={() => setCreatePostVisible(true)}
        className="w-full h-10 cursor-pointer text-start bg-slate-200 rounded-full ml-1 border-none outline-none pl-3 text-slate-800 hover:bg-slate-300 hover:text-slate-950"
      >
        {`What's up, ${currentUser?.userName}`} ?
      </button>
      {createPostVisible && (
        <CreatePostModal setCreatePostVisible={setCreatePostVisible} />
      )}
    </div>
  );
};

export default Post;
