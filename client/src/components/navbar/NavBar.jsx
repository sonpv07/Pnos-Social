import React, { useContext } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { DarkModeContext } from "../../context/DarkModeContext";
import { AuthContext } from "../../context/authContext";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Loading from "../loading/Loading";

export default function NavBar() {
  const { toggle, darkMode } = useContext(DarkModeContext);

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
    <div className="navbar">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {" "}
          <div className="left">
            <Link to="/home">
              <p>PnoS Social</p>
            </Link>
            <Link to="/home" style={{ height: "24px", width: "24px" }}>
              <HomeOutlinedIcon className="icon" />
            </Link>

            {darkMode ? (
              <LightModeOutlinedIcon className="icon" onClick={toggle} />
            ) : (
              <DarkModeOutlinedIcon className="icon" onClick={toggle} />
            )}
            <GridViewOutlinedIcon className="icon" />
            <div className="search-bar">
              <SearchOutlinedIcon className="icon" />
              <input type="text" placeholder="Search" />
            </div>
          </div>
          <div className="right">
            <MessageOutlinedIcon className="icon" />
            <NotificationsNoneOutlinedIcon className="icon" />
            <LogoutIcon className="icon" onClick={handleSignOut} />
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={`/profile/${user?.id}`}
            >
              <div className="user">
                <img src={"/upload/" + data.avatar} alt="" />
                <span>{`${data.firstName} ${data.lastName}`}</span>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
