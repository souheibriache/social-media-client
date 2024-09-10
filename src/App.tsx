import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFailure, fetchUserSuccess } from "./redux/auth/user-slice";
import { getCurrentUser } from "./utils/api";
import CompleteSignUp from "./pages/CompleteSignUp";
import PrivateRoute from "./components/PrivateRoute";
import AuthRoute from "./components/AuthRoute";
import GlobalChatComponent from "./components/GlobalChatComponent";

const App = () => {
  const { accessToken, hasProfile } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData?.profileNotFound) {
          dispatch(fetchUserSuccess({})); // Set hasProfile to false
          navigate("/complete-signup"); // Redirect if profile is not found
        } else if (userData?.payload) {
          dispatch(fetchUserSuccess(userData.payload));
          if (!hasProfile) navigate("/complete-signup");
        } else {
          console.error("Unexpected response data", userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        dispatch(fetchUserFailure(error));
      }
    };

    if (accessToken) getUserProfile();
  }, [accessToken]);

  return (
    <div className="h-full flex flex-col pt-14">
      <Header />
      <div className="flex-1">
        {!location.href.includes("messages") ? <GlobalChatComponent /> : <></>}
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/messages/" element={<Messages />} />
            <Route path="/messages/:chatId" element={<Messages />} />
          </Route>
          <Route path="/complete-signup" element={<CompleteSignUp />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
