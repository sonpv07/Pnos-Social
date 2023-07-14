import React, { useContext } from "react";
import "./rightbar.scss";
import { Link } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { makeRequest } from "../../axios.js";
import { AuthContext } from "../../context/authContext";
import moment from "moment";

export default function RightBar() {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["suggest"],
    queryFn: () =>
      makeRequest.get("/relationships/getSuggest").then((res) => {
        return res.data;
      }),
  });

  const {
    isLoading: aLoading,
    error: eLoading,
    data: aData,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: () =>
      makeRequest.get("/activities?userID=" + user.id).then((res) => {
        return res.data;
      }),
  });

  const mutationFollow = useMutation({
    mutationFn: (userID) => {
      return makeRequest.post("/relationships", {
        currentProfile: userID,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const handleFollow = (userID) => {
    mutationFollow.mutate(userID);
  };

  return (
    <div className="rightbar">
      <div className="container">
        <div className="item">
          <div className="title">
            <p>Follow Suggestion</p>
            <Link to={"/suggest"} className="link">
              <p>View All</p>
            </Link>
          </div>
          {data?.length > 0 ? (
            data?.slice(0, 3).map((info) => (
              <div className="user" key={info.followedUserID}>
                <Link to={`/profile/${info.followedUserID}`}>
                  <div className="userInfo">
                    <img src={`/upload/${info.avatar}`} alt="" />
                    <span>{info.name}</span>
                  </div>
                </Link>

                <div className="button-place">
                  <button
                    className="accept"
                    onClick={() => handleFollow(info.followedUserID)}
                  >
                    Follow
                  </button>
                  {/* <button className="reject">Reject</button> */}
                </div>
              </div>
            ))
          ) : (
            <p>Dont have any suggestions yet</p>
          )}
        </div>

        <div className="item">
          <p className="title">Latest Activites</p>
          {aData?.length > 0 ? (
            aData?.slice(0, 3).map((info) => (
              <div className="user" key={info.id}>
                {info.activityTypeID === 1 || info.activityTypeID === 2 ? (
                  <Link to={`/profile/${info.activityUserID}`}>
                    <div className="userInfo">
                      <img src={`/upload/${info.avatar}`} alt="" />
                      <p>
                        <span>{info.name}</span>{" "}
                        {info.activityTypeID === 1 && info.gender === "Female"
                          ? "change her avatar"
                          : info.activityTypeID === 1 && info.gender === "Male"
                          ? "change his avatar"
                          : info.activityTypeID === 2 &&
                            info.gender === "Female"
                          ? "change her cover image"
                          : "change his cover image"}
                      </p>
                    </div>
                  </Link>
                ) : info.activityTypeID === 3 ? (
                  <Link to={`/post/${info.activityPostID}`}>
                    <div className="userInfo">
                      <img src={`/upload/${info.avatar}`} alt="" />
                      <p>
                        <span>{info.name}</span> {info.type}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <Link to={`/story/${info.activityStoryID}`}>
                    <div className="userInfo">
                      <img src={`/upload/${info.avatar}`} alt="" />
                      <p>
                        <span>{info.name}</span> {info.type}
                      </p>
                    </div>
                  </Link>
                )}

                <div className="time">
                  <p>{moment(info.actionTime).fromNow()}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Dont have any activities yet</p>
          )}
        </div>

        <div className="item">
          <p className="title">Online Friends</p>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://st4.depositphotos.com/4196725/31385/i/600/depositphotos_313852012-stock-photo-young-handsome-man-pressing-lips.jpg"
                alt=""
              />
              <p>
                <span>Huy Pham</span>
              </p>
              <div className="online"></div>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://st4.depositphotos.com/4196725/31385/i/600/depositphotos_313852012-stock-photo-young-handsome-man-pressing-lips.jpg"
                alt=""
              />
              <p>
                <span>Huy Pham</span>
              </p>
              <div className="online"></div>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://st4.depositphotos.com/4196725/31385/i/600/depositphotos_313852012-stock-photo-young-handsome-man-pressing-lips.jpg"
                alt=""
              />
              <p>
                <span>Huy Pham</span>
              </p>
              <div className="online"></div>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://st4.depositphotos.com/4196725/31385/i/600/depositphotos_313852012-stock-photo-young-handsome-man-pressing-lips.jpg"
                alt=""
              />
              <p>
                <span>Huy Pham</span>
              </p>
              <div className="online"></div>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://st4.depositphotos.com/4196725/31385/i/600/depositphotos_313852012-stock-photo-young-handsome-man-pressing-lips.jpg"
                alt=""
              />
              <p>
                <span>Huy Pham</span>
              </p>
              <div className="online"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
