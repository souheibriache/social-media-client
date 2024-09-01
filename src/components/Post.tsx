import { useSelector } from "react-redux";
import defaultProfilePicture from "../assets/default-user.jpg";
import CreatePostModal from "./CreatePostModal";
import { useState } from "react";

type Props = {};

const Post = (props: Props) => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const { currentUser } = useSelector((state: any) => state.user);
  const [createPostVisible, setCreatePostVisible] = useState(false);
  return (
    <div className="px-3 flex bg-white flex-row h-16 w-96 mt-2 items-center rounded-md shadow-md">
      <img
        className="h-12 w-12 object-cover rounded-full"
        src={
          currentUser?.picture
            ? `${VITE_BACKEND_URL}${currentUser.picture}`
            : defaultProfilePicture
        }
      />
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
