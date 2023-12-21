import React, { useContext, useEffect, useState } from "react";
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
import { ChatContext } from "../../context/ChatContext.js";
import ChatBox from "../chat/ChatBox.jsx";

export default function RightBar() {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);

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
    openChatBox,
  } = useContext(ChatContext);

  const [online, setOnline] = useState([]);

  const [checkBoxChatExisted, setCheckBoxChatExisted] = useState(false);

  let onlineFriends = [];

  const { isLoading, error, data } = useQuery({
    queryKey: ["suggest"],
    queryFn: () =>
      makeRequest.get("/relationships/getSuggest").then((res) => {
        return res.data;
      }),
  });

  // get Box Chat
  const {
    isLoading: boxChatLoading,
    error: boxChatError,
    data: boxChatData,
  } = useQuery({
    enabled: receiver !== null,
    queryKey: ["chat", receiver?.id],
    queryFn: () =>
      makeRequest.get(`/chats/${user?.id}/${receiver?.id}`).then((res) => {
        return res.data;
      }),
    onSuccess: (data) => {
      openChatBox(data);
    },
  });

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

  const {
    isLoading: fIsLoading,
    error: fIsError,
    data: fData,
  } = useQuery({
    queryKey: ["friendList"],
    queryFn: () =>
      makeRequest.get("/relationships/friendList").then((res) => {
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

  // const openChatBox = (data) => {
  //   let check = false;
  //   outerloop: for (let i = 0; i < data?.length - 1; i++) {
  //     for (let j = 1; j < data?.length; j++) {
  //       if (data[i]?.boxchatID === data[j]?.boxchatID) {
  //         check = data[i]?.boxchatID;
  //         break outerloop;
  //       }
  //     }
  //   }

  //   if (check) {
  //     setIsOpenChat(true);
  //     setCurrentChatBox(check);
  //     if (isMinimize) {
  //       setIsMinimize(false);
  //     }
  //   } else if (!check && receiver !== null) {
  //     createBoxChat(user?.id, receiver?.id);
  //   }
  // };

  const handleFollow = (userID) => {
    mutationFollow.mutate(userID);
  };

  useEffect(() => {
    onlineFriends = [];
    setOnline(null);

    if (fData?.length > 0 && onlineUsers?.length > 0) {
      for (const e1 of fData) {
        for (const e2 of onlineUsers) {
          if (e1.id === e2.userID) {
            onlineFriends.push(e1);
          }
        }
      }
      setOnline(onlineFriends);
    }
  }, [onlineUsers]);

  return (
    <>
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
              <p className="none">Dont have any suggestions yet</p>
            )}
          </div>

          <div className="item online-friends">
            <p className="title">Online Friends</p>
            <div className="user-container">
              {online?.length > 0 ? (
                online.map((data) => (
                  <div
                    className="user"
                    key={data.id}
                    onClick={() => {
                      setReceiver(data);
                    }}
                  >
                    <div className="userInfo">
                      <img src={`/upload/${data.avatar}`} alt="" />
                      <p>
                        <span>{data.name}</span>
                      </p>
                      <div className="online"></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="nothing">No one online yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChatBox />
    </>
  );
}
