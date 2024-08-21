import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

type Props = {};

const AuthRoute = (props: Props) => {
  const { currentUser } = useSelector((state: any) => state.user);
  const { accessToken, refreshToken } = useSelector((state: any) => state.auth);

  if (currentUser && accessToken && refreshToken) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AuthRoute;
