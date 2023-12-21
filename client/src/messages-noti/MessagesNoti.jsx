import moment from "moment";
import "./MessagesNoti.scss";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import MessagesItem from "./MessagesItem";

export default function MessagesNoti({
  isOpenMessageNotification,
  setIsOpenMessageNotification,
}) {
  const { user } = useContext(AuthContext);

  const name = `${user.firstName} ${user.lastName}`;

  // get Box Chat
  const {
    isLoading: boxChatLoading,
    error: boxChatError,
    data: boxChatData,
  } = useQuery({
    enabled: isOpenMessageNotification === true,
    queryKey: ["boxChat"],
    queryFn: () =>
      makeRequest.get(`/chats/userChat/${user?.id}`).then((res) => {
        return res.data;
      }),
  });

  console.log(boxChatData);

  return (
    <div className="notification">
      <div className="title">
        <h2>Messages</h2>
        <Link to={`/`}>
          <p>View All</p>
        </Link>
      </div>

      <div className="notification-container">
        {boxChatLoading ? (
          <p>Loading...</p>
        ) : boxChatData ? (
          boxChatData?.map((data) => (
            <MessagesItem
              key={data.boxchatID}
              data={data}
              isOpenMessageNotification={isOpenMessageNotification}
              setIsOpenMessageNotification={setIsOpenMessageNotification}
            />
          ))
        ) : null}
      </div>
    </div>
  );
}
