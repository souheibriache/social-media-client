import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import defaultPicture from "../assets/default-user.jpg";
import { useState } from "react";
import { resetUser } from "../redux/auth/user-slice";
import { resetAuth } from "../redux/auth/auth-slice";
import { resetChat } from "../redux/auth/chat-slice";

const Header = () => {
  const { VITE_BACKEND_URL } = import.meta.env;
  const { currentUser } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [isHeaderMenuVisible, setisHeaderMenuVisible] =
    useState<boolean>(false);

  const logout = () => {
    dispatch(resetUser());
    dispatch(resetAuth());
    dispatch(resetChat());
  };
  return (
    <div className="bg-slate-200 fixed w-full top-0 z-10 ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={"/"}>
          <h1 className="font-bold">Social-app</h1>
        </Link>
        <ul className="flex justify-between gap-5 items-center">
          <Link to={"/"}>
            <li>Home</li>
          </Link>
          <Link to={"/about"}>
            <li>About Us</li>
          </Link>
          {!currentUser ? (
            <Link to={"/sign-in"}>
              <li>Sign in</li>
            </Link>
          ) : (
            <div
              className="flex items-center gap-3 relative cursor-pointer"
              onClick={() =>
                setisHeaderMenuVisible(
                  (isHeaderMenuVisible: boolean) => !isHeaderMenuVisible
                )
              }
            >
              <p>{currentUser.userName}</p>
              <img
                className="rounded-full min-w-10 max-w-10 h-10 object-cover"
                src={
                  currentUser.picture
                    ? `${VITE_BACKEND_URL}${currentUser.picture}`
                    : defaultPicture
                }
                alt="profile picture"
              />
              <div
                className={`absolute ease-in bg-slate-300 p-1 z-50 rounded-md top-10 ${
                  !isHeaderMenuVisible ? "hidden" : ""
                }`}
              >
                <ul>
                  <li className="px-6 ease-in py-2 rounded-md text-md font-semibold hover:bg-slate-200">
                    <Link to={`/profile/${currentUser?.userId}`}> Profile</Link>
                  </li>
                  <li className="px-6 ease-in py-2 rounded-md text-md font-semibold hover:bg-slate-200">
                    Invitations
                  </li>
                  <li className="px-6 ease-in py-2 rounded-md text-md font-semibold hover:bg-slate-200">
                    Settings
                  </li>
                  <li
                    className="px-6 ease-in py-2 rounded-md text-md font-semibold hover:bg-slate-200 text-white bg-red-500 "
                    onClick={() => logout()}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
