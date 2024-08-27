import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
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
import { jwtDecode } from "jwt-decode";
import GlobalChatComponent from "./components/GlobalChatComponent";

const App = () => {
  const { accessToken, refreshToken, hasProfile } = useSelector(
    (state: any) => state.auth
  );
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
          // navigate("/"); // Redirect to home if profile exists
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
    <>
      <Header />
      <GlobalChatComponent />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route element={<AuthRoute />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/" element={<Home />} />
        </Route>
        {/* <Route element={<PrivateRoute />}> */}
        <Route path="/complete-signup" element={<CompleteSignUp />} />
        {/* </Route> */}
      </Routes>
    </>
  );
};

export default App;
