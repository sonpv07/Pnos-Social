import React, { useContext } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import "./bottomNav.scss";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { makeRequest } from "../../axios";

export default function LabelBottomNavigation() {
  const { logout, APIData, user } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () =>
      makeRequest.get("/users/find/" + user.id).then((res) => {
        return res.data;
      }),
  });

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bottom-nav">
      <Link to={`/profile/${user?.id}`}>
        <img src={`/upload/${data?.avatar}`} alt="" />
      </Link>
      <MessageOutlinedIcon className="icon" />

      <NotificationsNoneOutlinedIcon className="icon" />

      <LogoutIcon className="icon" onClick={handleSignOut} />
    </div>
  );
}
