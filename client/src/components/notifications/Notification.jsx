import { Link } from "react-router-dom";
import "./Notification.scss";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function Notification() {
  const { user } = useContext(AuthContext);

  const {
    isLoading: aLoading,
    error: aError,
    data: aData,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: () =>
      makeRequest.get("/activities?userID=" + user.id).then((res) => {
        return res.data;
      }),
  });

  return (
    <>
      <div className="notification">
        <div className="title">
          <h2>Notifications</h2>
          <Link to={`/`}>
            <p>View All</p>
          </Link>
        </div>

        <div className="notification-container">
          {aData?.length > 0 ? (
            aData.map((info) => (
              <div className="user" key={info.id}>
                {info.activityTypeID === 1 || info.activityTypeID === 2 ? (
                  <Link to={`/post/${info.activityPostID}`}>
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
            <p>No notification yet</p>
          )}
        </div>
      </div>
    </>
  );
}
