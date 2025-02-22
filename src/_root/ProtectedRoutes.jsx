import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../context/userContext";

const ProtectedRoute = () => {
  const { user } = useContext(userContext);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
