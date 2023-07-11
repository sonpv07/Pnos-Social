import React, { useContext } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import "./bottomNav.scss";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("recents");

  const { logOut, user, APIData } = useContext(AuthContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  let checkCurrentUser;

  APIData.forEach((item) => {
    console.log(item === user.email);
    if (item.email === user.email) {
      checkCurrentUser = item.id;
    }
  });

  return (
    <div className="bottom-nav">
      <Link to={`/profile/${checkCurrentUser}`}>
        <img src={user.photoURL} alt="" />
      </Link>
      <MessageOutlinedIcon className="icon" />

      <NotificationsNoneOutlinedIcon className="icon" />

      <LogoutIcon className="icon" onClick={handleSignOut} />
    </div>
  );
}
