import React, { useContext, useEffect, useState } from "react";
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
import Notification from "../notifications/Notification";
import MessagesNoti from "../../messages-noti/MessagesNoti";
import { ChatContext } from "../../context/ChatContext";

export default function NavBar() {
  const { toggle, darkMode } = useContext(DarkModeContext);

  const { logout, APIData, user } = useContext(AuthContext);

  const { messageNoti, setMessageNoti, receiver } = useContext(ChatContext);

  const [isOpenOverlay, setIsOpenOverlay] = useState(false);

  const [isOpenNotification, setIsOpenNotification] = useState(false);

  const [isOpenMessageNotification, setIsOpenMessageNotification] =
    useState(false);

  const [list, setList] = useState();

  const [input, setInput] = useState("");

  // const [filter, setFilter] = useState("");

  const { isLoading, error, data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () =>
      makeRequest.get("/users/find/" + user.id).then((res) => {
        return res.data;
      }),
  });

  const {
    isLoading: uLoading,
    error: uEror,
    data: uData,
  } = useQuery({
    queryKey: ["allUser", input],
    queryFn: () =>
      makeRequest
        .get("/users/search?userName=" + "%" + input + "%")
        .then((res) => {
          return res.data;
        }),
  });

  const { data: unReadMessage } = useQuery({
    queryKey: ["unreadMessage"],
    queryFn: () =>
      makeRequest.get("/messages/getUnread/" + user.id).then((res) => {
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
    <>
      <div className="navbar">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {" "}
            <div className="left">
              <Link to="/home">
                <p className="title">PnoS Social</p>
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
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                />
                <div
                  className="filter"
                  style={
                    input !== "" ? { display: "flex" } : { display: "none" }
                  }
                >
                  {uData?.length > 0 ? (
                    uData?.map((search) => (
                      <Link
                        onClick={() => setInput("")}
                        key={search.id}
                        style={{ textDecoration: "none", color: "inherit" }}
                        to={`/profile/${search?.id}`}
                      >
                        <div className="user-item">
                          <img src={`/upload/${search?.avatar}`} alt="" />
                          <p className="name">{search?.name}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="nothing">
                      Can't find any users suit your input
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="right">
              <div className="icon-container">
                <MessageOutlinedIcon
                  className="icon"
                  onClick={() => {
                    setIsOpenMessageNotification(!isOpenMessageNotification);
                    setIsOpenOverlay(true);
                    setIsOpenNotification(false);
                  }}
                  style={
                    isOpenMessageNotification ? { color: "#0095f6" } : null
                  }
                />
                {unReadMessage?.length > 0 && <div className="new-noti"></div>}
              </div>

              <div className="icon-container">
                <NotificationsNoneOutlinedIcon
                  className="icon"
                  onClick={() => {
                    setIsOpenNotification(!isOpenNotification);
                    setIsOpenOverlay(true);
                    setIsOpenMessageNotification(false);
                  }}
                  style={isOpenNotification ? { color: "#0095f6" } : null}
                />
              </div>
              <div className="icon-container">
                <LogoutIcon className="icon" onClick={handleSignOut} />
              </div>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={`/profile/${user?.id}`}
              >
                <div className="user">
                  <img src={"/upload/" + data?.avatar} alt="" />
                </div>
              </Link>
              {isOpenMessageNotification && (
                <MessagesNoti
                  isOpenMessageNotification={isOpenMessageNotification}
                  setIsOpenMessageNotification={setIsOpenMessageNotification}
                />
              )}

              {isOpenNotification && <Notification />}
            </div>
          </>
        )}
      </div>
      {/* {isOpenOverlay && (
        <div
          className="overlay"
          onClick={() => {
            setIsOpenNotification(false);
            setIsOpenOverlay(false);
            setIsOpenMessageNotification(false);
          }}
        ></div>
      )} */}
    </>
  );
}
