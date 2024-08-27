import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { accessToken, hasProfile } = useSelector((state: any) => state.auth);

  if (!accessToken) {
    return <Navigate to="/sign-in" />;
  }

  // if (accessToken && !hasProfile) {
  //   return <Navigate to="/complete-signup" />;
  // }

  return <Outlet />;
};

export default PrivateRoute;
