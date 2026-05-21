import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppStore";

export default function PrivateRoute() {
  const { user, isLoading } = useAppSelector((state) => state.auth);

  
  if (isLoading) {
    return null; // Or show a loading spinner
  }

  // If requireAuth is true: redirect to login if NOT logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

 

  return <Outlet />;
}