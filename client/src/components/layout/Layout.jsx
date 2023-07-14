import React from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import NavBar from "../navbar/NavBar";
import RightBar from "../rightbar/RightBar";
import LeftBar from "../leftbar/LeftBar";
import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { AuthContext, UserAuth } from "../../context/authContext";
import LabelBottomNavigation from "../bottomNav/bottomNav";

export default function Layout() {
  const darkMode = useContext(DarkModeContext);
  const currentUser = useContext(AuthContext);

  const { user } = UserAuth();
  if (user === null) {
    return <Navigate to="/login" />;
  } else {
    <Navigate to="/home" />;
  }

  return (
    <div className={`theme-${darkMode.darkMode ? "dark" : "light"}`}>
      <NavBar />
      <div style={{ display: "flex" }}>
        <LeftBar />
        <div style={{ flex: 6 }}>
          <Outlet />
        </div>
        <RightBar />
      </div>
      <LabelBottomNavigation />
    </div>
  );
}
