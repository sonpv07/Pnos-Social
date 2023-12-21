import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./MessagesNoti.scss";
import { makeRequest } from "../axios";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import { useFetchReceiver } from "../hooks/useFetchReceiver";
import { ChatContext } from "../context/ChatContext";

export default function MessagesItem({
  data,
  isOpenMessageNotification,
  setIsOpenMessageNotification,
}) {
  const { user } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const {
    onlineUsers,
    isOpenChat,
    setIsOpenChat,
    receiver,
    setReceiver,
    isMinimize,
    setIsMinimize,
    createBoxChat,
    setCurrentChatBox,
    messageNoti,
    setMessageNoti,
  } = useContext(ChatContext);

  const {
    isLoading: latestMessageLoading,
    error: latestMessageError,
    data: latestMessageData,
  } = useQuery({
    queryKey: ["latestMessage", data.boxchatID],
    queryFn: () =>
      makeRequest.get(`/messages/getLatest/${data.boxchatID}`).then((res) => {
        return res.data;
      }),
  });

  useEffect(() => {
    if (latestMessageData && latestMessageData[0]?.isRead === 0) {
      setMessageNoti(true);
    } else {
      setMessageNoti(false);
    }
  }, [latestMessageData]);

  const onMarkAsRead = useMutation({
    mutationFn: (chatboxID) => {
      return makeRequest.put("/messages/markAsRead", chatboxID);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries();
    },
  });

  const truncateText = (text) => {
    let shortText = text?.substring(0, 20);

    if (text?.length > 20) {
      shortText = shortText + "...";
    }

    return shortText;
  };

  const handleMessageNotification = () => {
    onMarkAsRead.mutate({ boxchatID: data.boxchatID });
  };

  const openChatBox = (data) => {
    setReceiver(data);
    setIsOpenChat(true);
    setCurrentChatBox(data.boxchatID);
    setIsOpenMessageNotification(false);
  };

  return (
    <div
      className="item"
      key={data.id}
      onClick={() => {
        openChatBox(data);
        handleMessageNotification();
      }}
    >
      <div className="infor">
        <img src={`/upload/${data.avatar}`} alt="" />
        <div className="text">
          <p className="name">{data.name}</p>
          <p className="message">
            {latestMessageData
              ? latestMessageData[0]?.text !== undefined
                ? latestMessageData[0]?.senderID === user.id
                  ? `You: ${truncateText(latestMessageData[0]?.text)}`
                  : `${data?.firstName}: ${truncateText(
                      latestMessageData[0]?.text
                    )}`
                : "No message yet"
              : ""}
          </p>
        </div>
      </div>
      <div className="time">
        <span className="time-text">
          {latestMessageData
            ? latestMessageData[0]?.text !== undefined
              ? moment(latestMessageData[0]?.createTime).fromNow()
              : null
            : null}
        </span>
        {latestMessageData
          ? latestMessageData[0]?.isRead === 0 &&
            latestMessageData[0]?.senderID !== user.id && (
              <span className="message-notification"></span>
            )
          : null}
      </div>
    </div>
  );
}
