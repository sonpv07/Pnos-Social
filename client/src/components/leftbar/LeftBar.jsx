import React, { useContext } from "react";
import "./leftbar.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Loading from "../loading/Loading";

export default function LeftBar() {
  const { user, APIData } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () =>
      makeRequest.get("/users/find/" + user.id).then((res) => {
        return res.data;
      }),
  });

  const navigate = useNavigate();

  return (
    <div className="leftbar">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container">
          <div className="menu">
            <Link
              to={`/profile/${user.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="user">
                <img src={"/upload/" + data.avatar} />
                <span>{`${data.firstName} ${data.lastName}`}</span>
              </div>
            </Link>

            <div className="item" onClick={() => navigate("/friend")}>
              <img src={Friends} alt="" />
              <span>Friends</span>
            </div>
            <div className="item">
              <img src={Groups} alt="" />
              <span>Groups</span>
            </div>
            <div className="item">
              <img src={Market} alt="" />
              <span>Market Place</span>
            </div>
            <div className="item">
              <img src={Watch} alt="" />
              <span>Watch</span>
            </div>
            <div className="item">
              <img src={Memories} alt="" />
              <span>Memories</span>
            </div>
          </div>
          <hr />
          <div className="menu">
            <span>Your Shortcut</span>

            <div className="item">
              <img src={Events} alt="" />
              <span>Events</span>
            </div>
            <div className="item">
              <img src={Gaming} alt="" />
              <span>Gaming</span>
            </div>
            <div className="item">
              <img src={Gallery} alt="" />
              <span>Gallery</span>
            </div>
            <div className="item">
              <img src={Videos} alt="" />
              <span>Videos</span>
            </div>
            <div className="item">
              <img src={Messages} alt="" />
              <span>Messages</span>
            </div>
          </div>
          <hr />
          <div className="menu">
            <span>Others</span>

            <div className="item">
              <img src={Fund} alt="" />
              <span>Fundraiser</span>
            </div>
            <div className="item">
              <img src={Tutorials} alt="" />
              <span>Tutorials</span>
            </div>
            <div className="item">
              <img src={Courses} alt="" />
              <span>Courses</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
