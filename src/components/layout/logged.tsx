import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../navbar";
import { useStore } from "@/store";

export const LoggedLayout = () => {
  const { user } = useStore(store => store.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Navbar />

      <Outlet />
    </div>
  );
};
