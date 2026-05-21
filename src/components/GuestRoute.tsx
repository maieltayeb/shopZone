import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { RootState } from "../app/store";
export default function GuestRoute() {
  const { user,isLoading} = useSelector((state: RootState) => state.auth);

  // If user is logged in, redirect to profile (don't show login/register pages)
  return user ? <Navigate to="/profile" replace />:<Outlet />;

  // If not logged in, show the auth page (login/register)

}
